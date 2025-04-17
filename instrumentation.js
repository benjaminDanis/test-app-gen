/*                        INSTRUMENTATION
 * This file is executed once, when the NextJS server starts up.
 * You can use this file to execute one-off scripts.  It has full
 * env access.
 */

/**
 * This action will fetch the WSJ well-known public key (for cryptography) and store it in the
 * WSJPLUS_SPA_ARTICLE_PUBLC_KEY env (used in src/utils/crypto/web-crypto)
 */
async function getClientWellKnownPublicKey() {
  console.log('instrumentation: fetching WSJ public key...');
  let pubKeyFetch = await fetch(`${process.env.WSJ_HOMEPAGE}/client/.well-known/public-key`);
  let pubKeyJson = await pubKeyFetch.json();

  process.env.WSJPLUS_SPA_ARTICLE_PUBLIC_KEY = pubKeyJson.publicKey;
  console.log('instrumentation: successfully fetched WSJ public key');
}

/**
 * This function shoud only have other functions called in it.  Those functions should be written
 * below.
 */
export async function register() {
  // funcs that should only exec on the server
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // retrieve the public key for entitlements/article cryptography
    await getClientWellKnownPublicKey();

    // initialize the newrelic server
    // await import('newrelic');
  }
}
