import {
  assertEquals,
  assertThrowsAsync,
} from "https://deno.land/std/testing/asserts.ts";
import axiod from "./mod.ts";

Deno.test("Axiod with credentials should fail", async () => {
  await assertThrowsAsync(
    async (): Promise<void> => {
      await axiod.get("https://postman-echo.com/basic-auth");
    }
  );
});

Deno.test("Axiod with credentials should be ok", async () => {
  const data = await axiod.get("https://postman-echo.com/basic-auth", {
    withCredentials: true,
    auth: {
      username: "postman",
      password: "password",
    },
  });

  assertEquals(data.status, 200);
});
