const CAL_API_BASE = "https://api.cal.com/v2";

// Event types are looked up server-side by a short code so the client
// never needs to know (or be able to tamper with) raw Cal.com IDs.
const EVENT_TYPES = {
  "60min":  { id: 6350381, slug: "voice-lesson-60-min" },
  "45min":  { id: 6373120, slug: "studio-session-45-min" },
  "junior": { id: 6373151, slug: "junior-session-30-min" },
};

const SESSION_FOCUS_OPTIONS = ["Voice Lesson", "Audition/Role Prep", "Acting/Monologue Work"];
const EXPERIENCE_LEVEL_OPTIONS = [
  "High School / Young Emerging",
  "Collegiate / Advanced Student",
  "Working Professional / Community Artist",
  "Re-entering / Adult Hobbyist",
];

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function handleAvailability(request, env) {
  const url = new URL(request.url);
  const code = url.searchParams.get("eventType");
  const eventType = EVENT_TYPES[code];
  if (!eventType) {
    return jsonResponse({ error: "Unknown eventType" }, 400);
  }

  const now = new Date();
  const start = new Date(now.getTime() + 24 * 60 * 60 * 1000); // tomorrow
  const end = new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000); // 21-day booking window
  const timeZone = url.searchParams.get("timeZone") || "America/Denver";

  const calUrl = `${CAL_API_BASE}/slots?eventTypeId=${eventType.id}` +
    `&start=${start.toISOString()}&end=${end.toISOString()}&timeZone=${encodeURIComponent(timeZone)}`;

  const calRes = await fetch(calUrl, {
    headers: {
      "Authorization": `Bearer ${env.CAL_API_KEY}`,
      "cal-api-version": "2024-09-04",
    },
  });

  if (!calRes.ok) {
    const body = await calRes.text();
    return jsonResponse({ error: "Failed to load availability", detail: body }, 502);
  }

  const data = await calRes.json();
  return jsonResponse(data);
}

async function handleBook(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const { eventType: code, start, name, email, timeZone, sessionFocus, experienceLevel, notes } = body || {};
  const eventType = EVENT_TYPES[code];

  if (!eventType || !start || !name || !email || !timeZone) {
    return jsonResponse({ error: "Missing required fields" }, 400);
  }
  if (!SESSION_FOCUS_OPTIONS.includes(sessionFocus)) {
    return jsonResponse({ error: "Invalid sessionFocus" }, 400);
  }
  if (!EXPERIENCE_LEVEL_OPTIONS.includes(experienceLevel)) {
    return jsonResponse({ error: "Invalid experienceLevel" }, 400);
  }

  const payload = {
    start,
    eventTypeId: eventType.id,
    attendee: { name, email, timeZone },
    bookingFieldsResponses: {
      "Session-Focus": sessionFocus,
      "Experience---Background-Level": experienceLevel,
      ...(notes ? { notes } : {}),
    },
  };

  const calRes = await fetch(`${CAL_API_BASE}/bookings`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.CAL_API_KEY}`,
      "cal-api-version": "2024-08-13",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await calRes.json().catch(() => null);

  if (!calRes.ok) {
    return jsonResponse({ error: "Booking failed", detail: data }, calRes.status === 409 ? 409 : 502);
  }

  return jsonResponse(data);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/api/availability" && request.method === "GET") {
      return handleAvailability(request, env);
    }
    if (path === "/api/book" && request.method === "POST") {
      return handleBook(request, env);
    }

    // Rewrite bare paths to .html files
    if (path === "/" || path === "") {
      return env.ASSETS.fetch(new Request(new URL("/index.html", url), request));
    }

    if (!path.includes(".") && !path.endsWith("/")) {
      return env.ASSETS.fetch(new Request(new URL(path + ".html", url), request));
    }

    return env.ASSETS.fetch(request);
  },
};
