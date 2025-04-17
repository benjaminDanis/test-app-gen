/* eslint-disable no-plusplus, no-bitwise, no-param-reassign */
const symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');
const dictionary = {};
symbols.forEach((symbol, i) => {
  dictionary[symbol] = i;
});

function Encoder() {
  let encoded = '';
  let place = 6;
  let value = 0;

  /**
   * Converts an integer to k-bit unsigned binary, and appends it to the end of the bit stream.
   */
  function push(binary, k) {
    if (binary >= 2 ** k) {
      throw new Error('Invalid bit size.');
    }
    while (k > 0) {
      if (k >= place) {
        k -= place;
        encoded += symbols[value | ((binary >> k) & ((1 << place) - 1))];
        place = 6;
        value = 0;
      } else {
        place -= k;
        value |= (binary & ((1 << k) - 1)) << place;
        break;
      }
    }
  }

  /**
   * Encodes the bit stream to base64 format.
   */
  function flush() {
    let result = encoded;
    encoded = '';
    if (place !== 6) {
      result += symbols[value];
      place = 6;
      value = 0;
    }
    switch (result.length % 4) {
      case 1:
        result += '===';
        break;
      case 2:
        result += '==';
        break;
      case 3:
        result += '=';
        break;
      default:
        break;
    }
    return result;
  }

  return {
    flush,
    push,
  };
}

function Decoder() {
  let availableBits = 0;
  let input = '';
  let pos = 0;
  let residual = 6;

  function from(base64) {
    if (typeof base64 !== 'string' || base64.length % 4 !== 0) {
      throw new Error('Invalid base64 input.');
    }
    const match = base64.match(/=+/);
    if (match) {
      base64 = base64.slice(0, match.index);
    }
    availableBits = base64.length * 6;
    input = base64;
    pos = 0;
    residual = 6;
  }

  /**
   * Extracts the next k bits and converts it to decimal.
   */
  function pop(k) {
    if (availableBits <= 0) {
      return null;
    }
    let binary = 0;
    let value = dictionary[input.charAt(pos)];
    if (typeof value !== 'number') {
      throw new Error('Encounter invalid base64 symbol.');
    }
    k = Math.min(k, availableBits);
    availableBits -= k;
    while (k > 0) {
      if (k >= residual) {
        k -= residual;
        binary |= (value & ((1 << residual) - 1)) << k;

        if (pos < input.length - 1) {
          residual = 6;
          pos += 1;
          value = dictionary[input.charAt(pos)];
        }
      } else {
        binary |= (value & ((1 << residual) - 1)) >> (residual - k);
        residual -= k;
        break;
      }
    }
    return binary;
  }

  return {
    from,
    pop,
  };
}

export { Encoder, Decoder };
