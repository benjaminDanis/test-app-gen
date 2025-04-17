import { convertABTAdConfigToAdConfigObject, convertGenevaAdConfigToAdConfigObject } from '@newscorp-djcs/sonata-core/server/utils';

import { adsConfigFromOrchestrator } from '@/src/services/orchestrator';

const AD_CONFIG_ORIGIN = {
  abt: 'ABT',
  geneva: 'GENEVA',
  orchestrator: 'ORCHESTRATOR',
};


export default (() => {
  const transformers = new Map();
  transformers.set(AD_CONFIG_ORIGIN.geneva, convertGenevaAdConfigToAdConfigObject);
  transformers.set(AD_CONFIG_ORIGIN.orchestrator, convertGenevaAdConfigToAdConfigObject);
  transformers.set(AD_CONFIG_ORIGIN.abt, convertABTAdConfigToAdConfigObject);
  return async (options) => {
    const { data, origin } = await adsConfigFromOrchestrator(options);
    const t = transformers.get(origin);
    if (t) {
      return t(data);
    }
    console.error(`No data transformer found for origin: ${origin}`);
    return {};
  };
})();
