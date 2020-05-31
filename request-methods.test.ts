import {
  assertEquals,
  assertThrowsAsync,
} from "https://deno.land/std/testing/asserts.ts";
import axiod from "./mod.ts";

Deno.test("Axiod GET request using axiod(config)", async () => {
  const data = await axiod(
    "https://postman-echo.com/get?foo1=bar1&foo2=bar2",
  );

  assertEquals(data.data.args["foo1"], "bar1");
  assertEquals(data.data.args["foo2"], "bar2");
});

Deno.test("Axiod GET request using axiod.get(config)", async () => {
  const data = await axiod.get(
    "https://postman-echo.com/get?foo1=bar1&foo2=bar2",
  );

  assertEquals(data.data.args["foo1"], "bar1");
  assertEquals(data.data.args["foo2"], "bar2");
});

Deno.test("Axiod POST request with raw data", async () => {
  const data = await axiod.post(
    "https://postman-echo.com/post",
    "This is expected to be sent back as part of response body.",
  );

  assertEquals(
    data.data["data"],
    "This is expected to be sent back as part of response body.",
  );
});

Deno.test("Axiod POST request with JSON data", async () => {
  const data = await axiod.post("https://postman-echo.com/post", {
    foo1: "bar1",
    foo2: "bar2",
  });

  assertEquals(data.data.data["foo1"], "bar1");
  assertEquals(data.data.data["foo2"], "bar2");
});
