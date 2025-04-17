import { decryptData, encryptData } from './web-crypto';

export async function encryptArticle(article) {
  return await encryptData(article);
}

export async function decryptArticle(secretKey, encryptedDataHash) {
  return await decryptData(secretKey, encryptedDataHash);
}
