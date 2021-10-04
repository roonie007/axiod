import { assertEquals } from "./mods/testing-assert.ts";
import axiod from "./mod.ts";

Deno.test("Axiod using generic type", async () => {
  const { data } = await axiod<{ delay: string }>(
    "https://postman-echo.com/delay/2"
  );

  assertEquals(data.delay, "2");
});

Deno.test("Axiod.request using generic type", async () => {
  const { data } = await axiod.request<{ delay: string }>({
    url: "https://postman-echo.com/delay/2",
  });

  assertEquals(data.delay, "2");
});

Deno.test("Axiod.get using generic type", async () => {
  const { data } = await axiod.get<{ delay: string }>(
    "https://postman-echo.com/delay/2"
  );

  assertEquals(data.delay, "2");
});
