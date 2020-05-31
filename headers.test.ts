import {
  assertEquals,
  assertThrowsAsync,
} from "https://deno.land/std/testing/asserts.ts";
import axiod from "./mod.ts";

Deno.test("Axiod with custom request headers", async () => {
  const data = await axiod.get("https://postman-echo.com/headers", {
    headers: {
      "test-header": "Is Correct",
    },
  });

  assertEquals(data.data.headers["test-header"], "Is Correct");
});

Deno.test("Axiod with custom response headers", async () => {
  const data = await axiod.get(
    "https://postman-echo.com/response-headers?Content-Type=text/html&test=response_headers"
  );

  assertEquals(data.data["Content-Type"], "text/html");
  assertEquals(data.data["test"], "response_headers");
});
