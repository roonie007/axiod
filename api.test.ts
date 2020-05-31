import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";
import axiod from "./mod.ts";

Deno.test("Axiod should have request method helpers", function () {
  assertEquals(typeof axiod.request, "function");
  assertEquals(typeof axiod.get, "function");
  assertEquals(typeof axiod.head, "function");
  assertEquals(typeof axiod.options, "function");
  assertEquals(typeof axiod.delete, "function");
  assertEquals(typeof axiod.post, "function");
  assertEquals(typeof axiod.put, "function");
  assertEquals(typeof axiod.patch, "function");
});

Deno.test("Axiod should have factory method", function () {
  assertEquals(typeof axiod.create, "function");
});

const instance = axiod.create();
Deno.test("Instance should have request methods", function () {
  assertEquals(typeof instance.request, "function");
  assertEquals(typeof instance.get, "function");
  assertEquals(typeof instance.options, "function");
  assertEquals(typeof instance.head, "function");
  assertEquals(typeof instance.delete, "function");
  assertEquals(typeof instance.post, "function");
  assertEquals(typeof instance.put, "function");
  assertEquals(typeof instance.patch, "function");
});

// Deno.test('should have interceptors', function () {
//   assertEquals(typeof instance.interceptors.request,'object');
//   assertEquals(typeof instance.interceptors.response,'object');
// });
