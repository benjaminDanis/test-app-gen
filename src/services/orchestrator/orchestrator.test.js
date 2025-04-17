// This should be merged with ./orchestrator.spec.js at some point
import { getOrchestratorScripts } from '.';
import { getEntitlementsDataForB2BAuth } from '@/src/services/orchestrator/entitlementsDataForAuth';

beforeAll(() => {
  jest.resetModules();
});

jest.mock('@ace/orchestrator', () => (options) => {
  return options;
});

const expectedConfig = {
  abtOptions: {
    site: 'fnews',
    type: 'article',
  },
  format: 'configArray',
  product: 'fnews',
  scriptControlOptions: {
    cookies: {},
    entitlements: {
      entitlementsUrl: 'https://www.dev.wsj.com/client',
      isSPA: true,
    },
    proximicUrlParam: null,
    query: {},
  },
  type: 'default',
  useSSR: true,
};

describe('getOrchestratorScripts()', () => {
  test('should call orchestrator with {format: configArray}', () => {
    const options = {
      format: 'configArray',
      product: 'fnews',
    };
    const expected = getOrchestratorScripts(options);

    expect(expected).toEqual(expectedConfig);
  });

  test('should call orchestrator with {format: string}', () => {
    const options = {
      format: 'string',
      product: 'fnews',
    };
    const expected = getOrchestratorScripts(options);

    expect(expected).toEqual({
      ...expectedConfig,
      format: 'string',
    });
  });

  test('should call orchestrator with default format of "configArray"', () => {
    const options = {
      product: 'fnews',
      entitlements: {
        entitlementsUrl: '/client',
        isSPA: true,
      },
    };
    const expected = getOrchestratorScripts(options);

    expect(expected).toEqual(expectedConfig);
  });

  test('should call orchestrator with default product of wsj', () => {
    const options = {
      format: 'configArray',
    };
    const expected = getOrchestratorScripts(options);

    expect(expected).toEqual({
      ...expectedConfig,
      abtOptions: {
        site: 'wsj',
        type: 'article'
      },
      product: 'wsj',
    });
  });
});

describe('getOrchestratorScripts Entitlements', () => {
  test('should call getEntitlementsDataForB2BAuth when isB2BAuth is true', () => {
    const options = {
      format: 'configArray',
      product: 'fnews',
      isB2BAuth: true,
      path: '/some-path',
    };
    const expected = getOrchestratorScripts(options);

    const expectedEntitlementsData = getEntitlementsDataForB2BAuth(options.path);

    expect(expected.scriptControlOptions.entitlements).toEqual(
      expect.objectContaining({
        entitlementsUrl: expectedEntitlementsData.entitlementsUrl,
        suggestAuthUrl: expectedEntitlementsData.suggestAuthUrl,
        cookieName: expectedEntitlementsData.cookieName,
        loginCallbackPath: expectedEntitlementsData.loginCallbackPath,
        signOutPath: expectedEntitlementsData.signOutPath,
        validPaths: expectedEntitlementsData.validPaths,
        entitlementsAdditionalHeaders: expectedEntitlementsData.entitlementsAdditionalHeaders,
        productName: expectedEntitlementsData.productName,
        entitlementsName: expectedEntitlementsData.entitlementsName,
        authParamsAllowList: expectedEntitlementsData.authParamsAllowList,
        DOW_JONES_OAUTH: expectedEntitlementsData.DOW_JONES_OAUTH,
        redirectToHomepage: expectedEntitlementsData.redirectToHomepage,
      })
    );
  });
});
