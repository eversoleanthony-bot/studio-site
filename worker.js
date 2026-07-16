export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path !== "/coming-soon.html") {
      const isPage = path === "/" || path.endsWith(".html") || !path.includes(".");
      if (isPage) {
        const comingSoon = new URL("/coming-soon.html", url);
        return env.ASSETS.fetch(new Request(comingSoon, request));
      }
    }

    return env.ASSETS.fetch(request);
  },
};
