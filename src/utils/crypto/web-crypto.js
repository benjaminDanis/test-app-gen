import base64ArrayBuffer from './base64ArrayBuffer';
import { compress, decompress } from '../lzw';
// import { sendNewRelicNoticeError } from '@/src/utils/logger/newrelicNoticeError';

const webcryptoAPI = globalThis.crypto;
const ALGORITHM = 'AES-CTR';
const ASYMMETRIC_ALGORITHM = 'RSA-OAEP';
const ENCODING = 'base64';
const enc = new TextEncoder();
let dec = new TextDecoder('utf-8');
let publicKey;

// server function (getServerSideProps)
async function asymmetricEncryptKey(documentKey) {
  if (!publicKey) {
    publicKey = await importPublicKey();
  }

  const encryptedArrayBuffer = await webcryptoAPI.subtle.encrypt(
    {
      name: ASYMMETRIC_ALGORITHM,
      hash: 'SHA-1',
    },
    publicKey,
    documentKey
  );

  return encryptedArrayBuffer;
}

// server function (getServerSideProps)
function generateInitializationVector() {
  return webcryptoAPI.getRandomValues(new Uint8Array(16));
}

function encodeMessage(textMessage) {
  return enc.encode(textMessage);
}

function decodeMessage(arrayBuffer) {
  const arr = new Uint8Array(arrayBuffer);
  return dec.decode(arr);
}

// browser function
async function importDecryptionKey(secretKey) {
  // base64 to binary str
  const binaryKey = atob(secretKey);

  // binary str to Uint8Array
  const bufferSecretKey = new Uint8Array(binaryKey.length);
  for (let i = 0; i < binaryKey.length; i++) {
    bufferSecretKey[i] = binaryKey.charCodeAt(i);
  }

  // import for decryption
  return await webcryptoAPI.subtle.importKey('raw', bufferSecretKey.buffer, ALGORITHM, true, ['decrypt']);
}

// server function (getServerSideProps)
async function importEncryptionKey(secretKey) {
  return await webcryptoAPI.subtle.importKey('raw', Buffer.from(secretKey, ENCODING), ALGORITHM, true, ['encrypt']);
}

// server function (getServerSideProps)
async function importPublicKey() {
  let pubKeyB64 = process.env.WSJPLUS_SPA_ARTICLE_PUBLIC_KEY;

  try {
    return await webcryptoAPI.subtle.importKey(
      'spki',
      Buffer.from(pubKeyB64, ENCODING),
      { name: ASYMMETRIC_ALGORITHM, hash: 'SHA-1' },
      true,
      ['encrypt']
    );
  } catch (error) {
    // sendNewRelicNoticeError(error, { view: 'webCrypto' });
    console.error('[importPublicKey]: ', error);
  }
}

// server function (getServerSideProps)
async function subtleEncrypt(secretKey, text) {
  const iv = generateInitializationVector();
  const key = await importEncryptionKey(secretKey);

  let encoded = encodeMessage(text);
  const encryptedArrayBuffer = await webcryptoAPI.subtle.encrypt(
    {
      name: ALGORITHM,
      counter: iv,
      length: 128,
    },
    key,
    encoded
  );

  return {
    content: Buffer.from(encryptedArrayBuffer).toString(ENCODING),
    iv: Buffer.from(iv).toString(ENCODING),
  };
}

// browser function
async function subtleDecrypt(secretKey, hash) {
  try {
    const key = await importDecryptionKey(secretKey);

    const contentBufferFromString = Buffer.from(hash.content, ENCODING);
    const IVBufferFromString = Buffer.from(hash.iv, ENCODING);

    const decrypted = await webcryptoAPI.subtle.decrypt(
      { name: ALGORITHM, counter: IVBufferFromString, length: 128 },
      key,
      contentBufferFromString
    );

    return decodeMessage(decrypted);
  } catch (error) {
    // sendNewRelicNoticeError(error, { view: 'webCrypto' });
    console.error('[subtleDecrypt]: Error while decrypting article content...', error);
  }
}

// server function (getServerSideProps)
export async function generateDocumentKey(products = []) {
  // props to Marcin Pawelek for the following contrib that fixed our document key generator:
  // generate 32 bytes of random data in ArrayBuffer format
  const generatedDocumentKey = webcryptoAPI.getRandomValues(new Uint8Array(32));
  const productsSuffix = Buffer.from(products.join(','), 'utf-8');
  const documentKeyPayload = Buffer.concat([generatedDocumentKey, productsSuffix]);

  // encrypt the ArrayBuffer key -> encrypted ArrayBuffer
  const encryptedGeneratedDocumentKey = await asymmetricEncryptKey(documentKeyPayload);

  return {
    generatedDocumentKey, // original ArrayBuffer
    encryptedGeneratedDocumentKey, // encrypted ArrayBuffer
  };
}

// server function (getServerSideProps)
export async function encryptData(data, products) {
  const { generatedDocumentKey, encryptedGeneratedDocumentKey } = await generateDocumentKey(products);
  const compressed = compress(JSON.stringify(data));
  const { iv, content } = await subtleEncrypt(generatedDocumentKey, compressed);
  return {
    content,
    encryptedDocumentKey: base64ArrayBuffer(encryptedGeneratedDocumentKey), // now this is a base64 string
    iv,
  };
}

// browser function
export async function decryptData(documentKey, hash) {
  const decryptedCompressedData = await subtleDecrypt(documentKey, hash);
  return decompress(decryptedCompressedData);
}
