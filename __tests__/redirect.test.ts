import { assertEquals } from '../mods/testing-assert.ts';
import axiod from '../mod.ts';
import { TestServer } from '../mods/test-server.ts';

const port = 8080;

Deno.test('Axiod does not follow redirect', async () => {
  const server = new TestServer(port);

  const res = await axiod.get(
    `http://localhost:${port}/redirect`,
    { redirect: 'manual' },
  );

  assertEquals(res.status, 301);
  server.abort();
});

Deno.test('Axiod follows redirect', async () => {
  const server = new TestServer(port);

  const res = await axiod.get(
    `http://localhost:${port}/redirect`,
  );

  assertEquals(res.status, 200);
  server.abort();
});
