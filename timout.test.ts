import { assertEquals, assertThrowsAsync } from "testing/asserts.ts";
import axiod from "./mod.ts";

Deno.test("Axiod with big timeout", async () => {
  const data = await axiod("https://postman-echo.com/delay/2", {
    timeout: 5000,
  });

  assertEquals(data.status, 200);
});

Deno.test("Axiod with tiny timeout", async () => {
  await assertThrowsAsync(async (): Promise<void> => {
    await axiod.get("https://postman-echo.com/delay/2", {
      timeout: 100,
    });
  });
});
