import { assertEquals, assertThrowsAsync } from '../mods/testing-assert.ts';
import axiod from '../mod.ts';

Deno.test('Axiod with credentials should fail', async () => {
  await assertThrowsAsync(async (): Promise<void> => {
    await axiod.get('https://postman-echo.com/basic-auth').catch((err) => {
      if (err.response.status >= 300) {
        throw new Error('error');
      }
    });
  });
});

Deno.test('Axiod with credentials should be ok', async () => {
  const data = await axiod.get('https://postman-echo.com/basic-auth', {
    withCredentials: true,
    auth: {
      username: 'postman',
      password: 'password',
    },
  });

  assertEquals(data.status, 200);
});
