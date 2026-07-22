// Custom step-through scheduler used by the bundle-confirmed-*.html pages.
// Expects a global SCHEDULER_CONFIG = { eventType: '60min' } to be set
// before this script loads. Talks to /api/availability and /api/book,
// which the Cloudflare Worker proxies to the Cal.com API.

(function () {
  const cfg = window.SCHEDULER_CONFIG || {};
  const eventType = cfg.eventType;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Denver";

  const root = document.getElementById("scheduler-root");
  if (!root || !eventType) return;

  let bookedCount = 0;
  const params = new URLSearchParams(window.location.search);
  const totalSessions = parseInt(params.get("count"), 10) || null;

  const SESSION_FOCUS_OPTIONS = ["Voice Lesson", "Audition/Role Prep", "Acting/Monologue Work"];
  const EXPERIENCE_LEVEL_OPTIONS = [
    "High School / Young Emerging",
    "Collegiate / Advanced Student",
    "Working Professional / Community Artist",
    "Re-entering / Adult Hobbyist",
  ];

  function fmtDateHeading(dateStr) {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
  }

  function fmtTime(iso) {
    return new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }

  function progressLabel() {
    if (!totalSessions) return "";
    return `Session ${bookedCount + 1} of ${totalSessions}`;
  }

  function render(html) {
    root.innerHTML = html;
  }

  function renderLoading() {
    render(`<p class="scheduler-status">Loading available times…</p>`);
  }

  function renderError(msg, retry) {
    root.innerHTML = "";
    const p = document.createElement("p");
    p.className = "scheduler-status scheduler-error";
    p.textContent = msg;
    root.appendChild(p);
    if (retry) {
      const btn = document.createElement("button");
      btn.className = "scheduler-btn";
      btn.textContent = "Try Again";
      btn.addEventListener("click", retry);
      root.appendChild(btn);
    }
  }

  async function loadAvailability() {
    renderLoading();
    try {
      const res = await fetch(`/api/availability?eventType=${encodeURIComponent(eventType)}&timeZone=${encodeURIComponent(timeZone)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load availability");
      renderDateList(data.data || {});
    } catch (err) {
      renderError("Couldn't load available times. Please try again or contact Anthony directly.", loadAvailability);
    }
  }

  function renderDateList(slotsByDate) {
    const dates = Object.keys(slotsByDate).filter((d) => slotsByDate[d] && slotsByDate[d].length > 0).sort();

    if (dates.length === 0) {
      renderError("No open times in the next few weeks. Please contact Anthony directly to schedule.", null);
      return;
    }

    const wrap = document.createElement("div");
    wrap.className = "scheduler-step";

    if (progressLabel()) {
      const prog = document.createElement("div");
      prog.className = "scheduler-progress";
      prog.textContent = progressLabel();
      wrap.appendChild(prog);
    }

    const label = document.createElement("div");
    label.className = "scheduler-label";
    label.textContent = "Choose a date";
    wrap.appendChild(label);

    const list = document.createElement("div");
    list.className = "scheduler-date-list";
    dates.forEach((dateStr) => {
      const btn = document.createElement("button");
      btn.className = "scheduler-date-btn";
      btn.textContent = fmtDateHeading(dateStr);
      btn.addEventListener("click", () => renderTimeList(dateStr, slotsByDate[dateStr]));
      list.appendChild(btn);
    });
    wrap.appendChild(list);

    root.innerHTML = "";
    root.appendChild(wrap);
  }

  function renderTimeList(dateStr, slots) {
    const wrap = document.createElement("div");
    wrap.className = "scheduler-step";

    if (progressLabel()) {
      const prog = document.createElement("div");
      prog.className = "scheduler-progress";
      prog.textContent = progressLabel();
      wrap.appendChild(prog);
    }

    const back = document.createElement("button");
    back.className = "scheduler-back";
    back.textContent = "← Choose a different date";
    back.addEventListener("click", loadAvailability);
    wrap.appendChild(back);

    const label = document.createElement("div");
    label.className = "scheduler-label";
    label.textContent = fmtDateHeading(dateStr);
    wrap.appendChild(label);

    const list = document.createElement("div");
    list.className = "scheduler-time-list";
    slots.forEach((slot) => {
      const btn = document.createElement("button");
      btn.className = "scheduler-time-btn";
      btn.textContent = fmtTime(slot.start);
      btn.addEventListener("click", () => renderBookingForm(slot.start, dateStr));
      list.appendChild(btn);
    });
    wrap.appendChild(list);

    root.innerHTML = "";
    root.appendChild(wrap);
  }

  function renderBookingForm(startIso, dateStr) {
    const wrap = document.createElement("div");
    wrap.className = "scheduler-step";

    if (progressLabel()) {
      const prog = document.createElement("div");
      prog.className = "scheduler-progress";
      prog.textContent = progressLabel();
      wrap.appendChild(prog);
    }

    const back = document.createElement("button");
    back.className = "scheduler-back";
    back.textContent = "← Choose a different time";
    back.addEventListener("click", () => loadAvailability());
    wrap.appendChild(back);

    const label = document.createElement("div");
    label.className = "scheduler-label";
    label.textContent = `${fmtDateHeading(dateStr)} at ${fmtTime(startIso)}`;
    wrap.appendChild(label);

    const form = document.createElement("form");
    form.className = "scheduler-form";
    form.innerHTML = `
      <div class="scheduler-form-row">
        <label>Name<input type="text" name="name" required /></label>
        <label>Email<input type="email" name="email" required /></label>
      </div>
      <label>Session Focus
        <select name="sessionFocus" required>
          <option value="" disabled selected>Select one</option>
          ${SESSION_FOCUS_OPTIONS.map((o) => `<option value="${o}">${o}</option>`).join("")}
        </select>
      </label>
      <label>Experience Level
        <select name="experienceLevel" required>
          <option value="" disabled selected>Select one</option>
          ${EXPERIENCE_LEVEL_OPTIONS.map((o) => `<option value="${o}">${o}</option>`).join("")}
        </select>
      </label>
      <label>Notes (optional)<textarea name="notes" rows="2"></textarea></label>
      <button type="submit" class="scheduler-btn scheduler-btn-submit">Confirm Session</button>
      <p class="scheduler-form-error" hidden></p>
    `;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector(".scheduler-btn-submit");
      const errorEl = form.querySelector(".scheduler-form-error");
      errorEl.hidden = true;
      submitBtn.disabled = true;
      submitBtn.textContent = "Booking…";

      const fd = new FormData(form);
      try {
        const res = await fetch("/api/book", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventType,
            start: startIso,
            timeZone,
            name: fd.get("name"),
            email: fd.get("email"),
            sessionFocus: fd.get("sessionFocus"),
            experienceLevel: fd.get("experienceLevel"),
            notes: fd.get("notes") || undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 409) {
            errorEl.textContent = "That time was just booked by someone else. Please pick another.";
            errorEl.hidden = false;
            submitBtn.disabled = false;
            submitBtn.textContent = "Confirm Session";
            setTimeout(loadAvailability, 1500);
            return;
          }
          throw new Error((data && data.error) || "Booking failed");
        }
        bookedCount++;
        renderConfirmation(dateStr, startIso);
      } catch (err) {
        errorEl.textContent = "Something went wrong booking that session. Please try again.";
        errorEl.hidden = false;
        submitBtn.disabled = false;
        submitBtn.textContent = "Confirm Session";
      }
    });

    wrap.appendChild(form);
    root.innerHTML = "";
    root.appendChild(wrap);
  }

  function renderConfirmation(dateStr, startIso) {
    const wrap = document.createElement("div");
    wrap.className = "scheduler-step scheduler-confirmation";

    const check = document.createElement("div");
    check.className = "scheduler-check";
    check.textContent = "✓";
    wrap.appendChild(check);

    const msg = document.createElement("div");
    msg.className = "scheduler-label";
    msg.textContent = `Booked — ${fmtDateHeading(dateStr)} at ${fmtTime(startIso)}`;
    wrap.appendChild(msg);

    const done = totalSessions && bookedCount >= totalSessions;

    if (done) {
      const p = document.createElement("p");
      p.className = "scheduler-status";
      p.textContent = "All your sessions are on the calendar. See you soon!";
      wrap.appendChild(p);
    } else {
      const btn = document.createElement("button");
      btn.className = "scheduler-btn";
      btn.textContent = totalSessions ? "Book Next Session" : "Book Another Session";
      btn.addEventListener("click", loadAvailability);
      wrap.appendChild(btn);
    }

    root.innerHTML = "";
    root.appendChild(wrap);
  }

  loadAvailability();
})();
