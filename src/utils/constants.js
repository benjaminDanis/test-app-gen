const DATA_PROVIDER_API = '/api/data-provider';

export const DEFAULT_SITE = 'wsj';
export const HOMEPAGE_L1 = 'US Home Page';
export const HOMEPAGE_BANNER_LOCATION = 'TOPBANNER';

export const ENDPOINTS = {
  entitlementsUrl: process.env.WEB_PLATFORM_ENTITLEMENTS,
  dataProviderApi: DATA_PROVIDER_API,
  redirectUrl: process.env.NEXT_PUBLIC_REDIRECT_URL,
};

export const ORCHESTRATOR_FLAGS = {
  isSPA: process.env.ORCHESTRATOR_IS_SPA === 'true',
}

export const DOW_JONES_OAUTH = {
  OID_BASE_URL: process.env.OID_BASE_URL,
  OID_TOKEN_BASE_URL: process.env.OID_TOKEN_BASE_URL,
  OID_CLIENT_ID: process.env.OID_CLIENT_ID,
  OID_PRODUCT_NAME: process.env.OID_PRODUCT_NAME,
  AUTHORIZE_SCOPE_V2: process.env.AUTHORIZE_SCOPE_V2,
  RESPONSE_TYPE: process.env.RESPONSE_TYPE,
  CONNECTION: process.env.CONNECTION,
  DELEGATION_SCOPE: process.env.DELEGATION_SCOPE,
  GRANT_TYPE: process.env.GRANT_TYPE,
};