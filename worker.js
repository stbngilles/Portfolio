export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Route all non-file paths to index.html (single-page app behavior)
    const shouldServeIndex =
      url.pathname === "/" ||
      !url.pathname.split("/").pop().includes(".");

    if (shouldServeIndex) {
      return env.ASSETS.fetch(new Request(new URL("/index.html", url), request));
    }

    // Static asset passthrough
    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.status !== 404) return assetResponse;

    // Fallback 404
    return new Response("Not found", { status: 404 });
  },
};
