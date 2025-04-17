import { ENDPOINTS, DOW_JONES_OAUTH, ORCHESTRATOR_FLAGS } from '@/src/utils/constants';
const { B2B_ENTITLEMENTS_URL, COOKIE_NAME, AUTH_CALLBACK, AUTH_QUERY_PARAMS, SUGGEST_BASE_URL } = process.env;

/**
 * @typedef {Object} DOW_JONES_OAUTH
 * @property {string} CONNECTION - OAuth connection parameter.
 * @property {string} RESPONSE_TYPE - OAuth response type.
 * @property {string} OID_CLIENT_ID - OAuth client ID.
 * @property {string} AUTHORIZE_SCOPE_V2 - OAuth authorization scope.
 * @property {string} OID_PRODUCT_NAME - OAuth product name.
 * @property {string} OID_BASE_URL - OAuth base URL.
 */

/**
 * @typedef {Object} EntitlementsData
 * @property {string} entitlementsUrl - The URL to get the entitlements.
 * @property {string} suggestAuthUrl - The URL to get the suggest context.
 * @property {DOW_JONES_OAUTH} DOW_JONES_OAUTH - OAuth configuration object.
 * @property {string} cookieName - The name of the cookie to store the access token.
 * @property {string[]} validPaths - The paths where the entitlements should be requested and set.
 * @property {Object} entitlementsAdditionalHeaders - Additional headers to be sent with the entitlements request.
 * @property {string} loginCallbackPath - The path where the login callback is handled.
 * @property {string} signOutPath - The path where the sign-out is handled.
 * @property {string} productName - The name of the product to set a proper cookie name.
 * @property {string} entitlementsName - The name of the entitlements to set in the dataLayer.
 * @property {string[]} authParamsAllowList - The list of query parameters to include in the authorization.
 */

/**
 * This is the data needed by ace to correctly authenticate the user with the B2B auth. See {@link setEntitlementsB2BInlineScript}
 * I avoid the encryptedDocumentKey and isArticle flags because they are used inside the sonata-react package to determine if the user has access to the article. See {@link useEntitlements}
 * @constant {EntitlementsData}
 */
export const getEntitlementsDataForB2BAuth = (path) => ({
  entitlementsUrl: B2B_ENTITLEMENTS_URL,
  suggestAuthUrl: SUGGEST_BASE_URL,
  cookieName: COOKIE_NAME,
  loginCallbackPath: AUTH_CALLBACK,
  signOutPath: '/signout',
  validPaths: ['/'],
  entitlementsAdditionalHeaders: { 'X-DJ-Access-Point-Code': 'O' },
  productName: 'product',
  entitlementsName: 'product_entitlements',
  authParamsAllowList: JSON.parse(AUTH_QUERY_PARAMS),
  DOW_JONES_OAUTH,
  redirectToHomepage: path === '/404',
});

/**
 * This is the data needed by ace to correctly authenticate the user with the B2C auth. See {@link setEntitlementsB2CInlineScript}
 */
export const getEntitlementsDataForB2CAuth = {
  isSPA: ORCHESTRATOR_FLAGS?.isSPA,
  entitlementsUrl: ENDPOINTS?.entitlementsUrl,
};
