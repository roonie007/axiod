import { serve } from "https://deno.land/std@0.118.0/http/server.ts";

export class TestServer {
    port: number;
    controller = new AbortController()

    constructor(port: number) {
      this.port = port;
      serve(this.handler, { port: this.port, signal: this.controller.signal });
    }
    
    handler(request: Request): Response {
      if (request.url.includes("redirect")) {
          return new Response(null, {
              status: 301,
              headers: { 'Location': '/newlocation' }
          });
      }

        if (request.url.includes("newlocation")) {
            return new Response(null, { status: 200 });
        }
        return new Response(null, { status: 404 });
    }

    abort(): void {
        this.controller.abort();
    }
}