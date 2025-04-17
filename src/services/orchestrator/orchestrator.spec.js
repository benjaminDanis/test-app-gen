// This should be merged with ./orchestrator.test.js at some point
import { getOrchestratorScripts } from '.';

beforeAll(() => {
  jest.resetModules();
});

const scriptTag = `
  <script
    id="uac"
    src="https://www.wsj.com/asset/ace/uac.min.1.0.53.js"
    async=""
    data-params="{'enableDjcmp':true,'enablePermutive':true,'enablePublisherProvidedId':true,'permutiveSourcepointId':'5eff0d77969bfa03746427eb'}"
  ></script>
`;

const scriptTagConfig = {
  type: 'script',
  opts: {
    id: 'uac',
    src: 'https://www.wsj.com/asset/ace/uac.min.1.0.53.js',
    async: true,
    'data-params':
      '{"enableDjcmp":true,"enablePermutive":true,"enablePublisherProvidedId":true,"permutiveSourcepointId":"5eff0d77969bfa03746427eb"}',
  },
};

jest.mock('@ace/orchestrator', () => (options) => {
  const { format } = options;

  if (format === 'configArray') {
    return [scriptTagConfig];
  }

  return scriptTag;
});

describe('getOrchestratorScripts()', () => {
  test('should return array of scripts config objects', () => {
    const options = {
      format: 'configArray',
      product: 'fnews',
    };
    const expected = getOrchestratorScripts(options);

    expect(expected).toEqual([scriptTagConfig]);
  });

  test('should return string of generated scripts', () => {
    const options = {
      format: 'string',
      product: 'fnews',
    };
    const expected = getOrchestratorScripts(options);

    expect(expected).toEqual(scriptTag);
  });
});
