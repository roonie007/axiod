import { assertEquals } from '../mods/testing-assert.ts';
import axiod from '../mod.ts';
import { IAxiodResponse } from '../interfaces.ts';

Deno.test('Axiod request with ArrayBuffer as responseType', async () => {
  const { data } = await axiod.get<ArrayBuffer>(
    'https://picsum.photos/seed/picsum/200/300',
    { responseType: 'arraybuffer' },
  );

  assertEquals(data instanceof ArrayBuffer, true);
});

Deno.test('Axiod request with Stream as responseType', async () => {
  const { data } = await axiod.get<ReadableStream>(
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    { responseType: 'stream' },
  );

  assertEquals(data instanceof ReadableStream, true);
});

Deno.test('Axiod request with Blob as responseType', async () => {
  const { data } = await axiod.get<Blob>(
    'https://picsum.photos/seed/picsum/200/300',
    { responseType: 'blob' },
  );

  assertEquals(data instanceof Blob, true);
});
