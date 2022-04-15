import { assertEquals } from '../mods/testing-assert.ts';
import axiod from '../mod.ts';
import { IAxiodResponse } from '../interfaces.ts';

Deno.test('Axiod request interceptor', async () => {
  axiod.interceptors.request.use((config) => {
    config.url = 'https://postman-echo.com/delay/3';
    return config;
  });

  const { data } = await axiod.get<{ delay: string }>(
    'https://postman-echo.com/delay/2',
  );

  assertEquals(data.delay, '3');
});

Deno.test('Axiod instance request interceptor', async () => {
  const instance = axiod.create();

  instance.interceptors.request.use((config) => {
    config.url = 'https://postman-echo.com/delay/3';
    return config;
  });

  const { data } = await instance.get<{ delay: string }>(
    'https://postman-echo.com/delay/2',
  );

  assertEquals(data.delay, '3');
});

Deno.test('Axiod instance request interceptor should not execute if it was ejected', async () => {
  const instance = axiod.create();

  const interceptorId = instance.interceptors.request.use((config) => {
    config.url = 'https://postman-echo.com/delay/3';
    return config;
  });

  instance.interceptors.request.eject(interceptorId);

  const { data } = await instance.get<{ delay: string }>(
    'https://postman-echo.com/delay/2',
  );

  assertEquals(data.delay, '2');
});

Deno.test('Axiod instance response interceptor', async () => {
  const instance = axiod.create();

  instance.interceptors.response.use((response: IAxiodResponse<{ delay: number }>) => {
    response.data.delay = 10;
    return response;
  });

  const { data } = await instance.get<{ delay: string }>(
    'https://postman-echo.com/delay/2',
  );

  assertEquals(data.delay, 10);
});

Deno.test('Axiod instance response interceptor should not execute if it was ejected', async () => {
  const instance = axiod.create();

  const interceptorId = instance.interceptors.response.use((response: IAxiodResponse<{ delay: number }>) => {
    response.data.delay = 10;
    return response;
  });

  instance.interceptors.response.eject(interceptorId);

  const { data } = await instance.get<{ delay: string }>(
    'https://postman-echo.com/delay/2',
  );

  assertEquals(data.delay, '2');
});
