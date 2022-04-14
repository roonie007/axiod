import { assertEquals } from './mods/testing-assert.ts';
import axiod from './mod.ts';

Deno.test('Axiod GET request using axiod(config)', async () => {
  const data = await axiod('https://postman-echo.com/get?foo1=bar1&foo2=bar2');

  assertEquals(data.data.args['foo1'], 'bar1');
  assertEquals(data.data.args['foo2'], 'bar2');
});

Deno.test('Axiod GET request using axiod.get(config)', async () => {
  const data = await axiod.get(
    'https://postman-echo.com/get?foo1=bar1&foo2=bar2',
  );

  assertEquals(data.data.args['foo1'], 'bar1');
  assertEquals(data.data.args['foo2'], 'bar2');
});

Deno.test('Axiod POST request with raw data', async () => {
  const data = await axiod.post(
    'https://postman-echo.com/post',
    'This is expected to be sent back as part of response body.',
  );

  assertEquals(
    data.data['data'],
    'This is expected to be sent back as part of response body.',
  );
});

Deno.test('Axiod POST request with JSON data', async () => {
  const data = await axiod.post('https://postman-echo.com/post', {
    foo1: 'bar1',
    foo2: 'bar2',
  });

  assertEquals(data.data.data['foo1'], 'bar1');
  assertEquals(data.data.data['foo2'], 'bar2');
});

Deno.test('Axiod Create baseURL fix', async () => {
  const ax = axiod.create({ baseURL: 'https://postman-echo.com' });
  const data = await ax.post('/post', { foo1: 'bar1', foo2: 'bar2' });
  assertEquals(data.data.data['foo1'], 'bar1');
  assertEquals(data.data.data['foo2'], 'bar2');
});

Deno.test('Axiod POST request with URLSearchParams', async () => {
  const body = new URLSearchParams();
  body.append('PARAM1', 'value1');
  body.append('PARAM2', 'value2');

  const data = await axiod.post('https://postman-echo.com/post', body);

  assertEquals(data.data.form['PARAM1'], 'value1');
  assertEquals(data.data.form['PARAM2'], 'value2');
});
