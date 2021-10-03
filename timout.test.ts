import { assertEquals, assertThrowsAsync } from "testing/asserts.ts";
import axiod from "./mod.ts";

// [TODO] Mouadh HSOUMI
// Remove commented test when Abort is supported by Deno
// https://github.com/denoland/deno/issues/5471
// https://github.com/Code-Hex/deno-context/issues/8

// Deno.test("Axiod with big timeout", async () => {
//   const data = await axiod("https://postman-echo.com/delay/2", {
//     timeout: 5000,
//   });

//   assertEquals(data.status, 200);
// });

// Deno.test("Axiod with tiny timeout", async () => {
//   await assertThrowsAsync(
//     async (): Promise<void> => {
//       await axiod.get("https://postman-echo.com/delay/2", {
//         headers: {
//           "test-header": "Is Correct",
//         },
//         timeout: 100,
//       });
//     },
//   );
// });
