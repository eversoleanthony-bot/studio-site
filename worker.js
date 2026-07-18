export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

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
