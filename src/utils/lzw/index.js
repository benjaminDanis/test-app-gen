/* eslint-disable no-plusplus, no-constant-condition */
import { Decoder, Encoder } from './Base64';

const fcc = String.fromCharCode;
const END_OF_STREAM = 0;
const CHARACTER_7 = 1;
const CHARACTER_16 = 2;

function compress(input) {
  if (typeof input !== 'string') {
    return null;
  }
  if (input.length === 0) {
    return '';
  }
  const encoder = Encoder();
  // Use Object.create(null) instead of {}
  // because {} inherits methods from Object.prototype such as 'toString'
  // which may lead to subtle bugs if the input contains stringified JS code.
  const dict = Object.create(null);
  let tokenBits = 2;
  let dictIndex = 2;
  let dictIndexMax = 2 ** tokenBits;

  let prevWord = input.charAt(0);
  let currChar;
  let currWord;
  let code;
  let i = 1;
  while (i < input.length) {
    currChar = input.charAt(i);
    currWord = prevWord + currChar;
    if (dict[currWord]) {
      prevWord = currWord;
    } else {
      if (dict[prevWord]) {
        encoder.push(dict[prevWord], tokenBits);
      } else {
        code = prevWord.charCodeAt(0);
        if (code < 128) {
          encoder.push(CHARACTER_7, tokenBits);
          encoder.push(code, 7);
        } else {
          encoder.push(CHARACTER_16, tokenBits);
          encoder.push(code, 16);
        }
        dict[prevWord] = ++dictIndex;
      }
      dict[currWord] = ++dictIndex;
      prevWord = currChar;
      if (dictIndex >= dictIndexMax) {
        tokenBits += 1;
        dictIndexMax *= 2;
      }
    }
    i += 1;
  }
  if (dict[prevWord]) {
    encoder.push(dict[prevWord], tokenBits);
  } else {
    code = prevWord.charCodeAt(0);
    if (code < 128) {
      encoder.push(CHARACTER_7, tokenBits);
      encoder.push(code, 7);
    } else {
      encoder.push(CHARACTER_16, tokenBits);
      encoder.push(code, 16);
    }
    dict[prevWord] = ++dictIndex;
  }
  if (dictIndex + 1 >= dictIndexMax) {
    tokenBits += 1;
  }
  encoder.push(END_OF_STREAM, tokenBits);
  return encoder.flush();
}

function decompress(input) {
  if (typeof input !== 'string') {
    return null;
  }
  if (input.length === 0) {
    return '';
  }
  const decoder = Decoder();
  decoder.from(input);

  const dict = [];
  let tokenBits = 2;
  let dictIndex = 2;
  let dictIndexMax = 2 ** tokenBits - 1; // decompression is one step behind compression

  let isPrevChar = true;
  let prevWord = decoder.pop(tokenBits) === CHARACTER_7 ? fcc(decoder.pop(7)) : fcc(decoder.pop(16));
  let currCode;
  let currWord;
  let decoded = prevWord;
  while (true) {
    if (isPrevChar) {
      dict[++dictIndex] = prevWord;
      isPrevChar = false;
    }
    if (dictIndex >= dictIndexMax) {
      tokenBits += 1;
      dictIndexMax = 2 ** tokenBits - 1;
    }
    currCode = decoder.pop(tokenBits);
    if (currCode === END_OF_STREAM) {
      break;
    } else if (currCode === CHARACTER_7) {
      currWord = fcc(decoder.pop(7));
      isPrevChar = true;
    } else if (currCode === CHARACTER_16) {
      currWord = fcc(decoder.pop(16));
      isPrevChar = true;
    } else if (dict[currCode]) {
      currWord = dict[currCode];
    } else {
      currWord = prevWord + prevWord.charAt(0);
    }
    dict[++dictIndex] = prevWord + currWord.charAt(0);
    decoded += currWord;
    prevWord = currWord;
  }
  return decoded;
}

export { compress, decompress };
