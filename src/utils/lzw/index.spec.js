import article from './article.json';
import { compress, decompress } from './index';

let printableUTF16 = '';
for (let i = 32; i < 127; i += 1) {
  printableUTF16 += String.fromCharCode(i);
}
for (let i = 160; i < 55296; i += 1) {
  printableUTF16 += String.fromCharCode(i);
}
for (let i = 63744; i < 65536; i += 1) {
  printableUTF16 += String.fromCharCode(i);
}

describe('Should recover the uncompressed text', () => {
  const samples = [
    { name: 'Expanded article body', text: JSON.stringify(article) },
    { name: 'All printable UTF-16 characters', text: printableUTF16 },
    { name: 'Emojis', text: '😉🍐🧒👑🐨👟😞😇👩‍👧👙🧥👩‍⚕️🦁💪🤩⛪️🕵️😒🥼☝️😟🗨🗜🎓🕣⁉️🤒🎳🈳🌫️🦉🐑🍞🌊🍋' },
    { name: 'Repeated characters', text: 'aaaabbabbbbbaaabbabbbbbaaabbabbbbaaaaaabbabbbbbaa' },
  ];

  samples.forEach(({ name, text }) => {
    test(`${name}`, () => {
      const compressed = compress(text);
      const decompressed = decompress(compressed);
      expect(compressed).not.toBe(text);
      expect(decompressed).toBe(text);
    });
  });
});
