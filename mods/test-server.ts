import { Application } from "https://deno.land/x/oak@v10.5.1/mod.ts";

export class TestServer {
  app: Application;
  port: number;
  controller = new AbortController();

  constructor(port: number) {
    this.port = port;
    this.app = new Application();

    this.app.use((ctx) => {
      if (ctx.request.url.pathname.includes("redirect")) {
        ctx.response.status = 301;
        ctx.response.headers.set("Location", "/new-location");
      } else if (ctx.request.url.pathname.includes("new-location")) {
        ctx.response.status = 200;
      } else {
        ctx.response.status = 404;
      }
    });

    this.app.listen({ port: this.port, signal: this.controller.signal });
  }

  abort(): void {
    this.controller.abort();
  }
}
