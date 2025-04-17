import orchestrator from '@ace/orchestrator';

import {
  getEntitlementsDataForB2BAuth,
  getEntitlementsDataForB2CAuth,
} from '@/src/services/orchestrator/entitlementsDataForAuth';
import { DEFAULT_SITE } from '@/src/utils/constants';

const isASection = (abtOptions) => {
  return abtOptions.section || abtOptions.subsection;
};

const SECTION_ABT_TYPE = 'section';
const ARTICLE_ABT_TYPE = 'article';

/**
 * Generates Orchestrator scripts based on the provided options.
 *
 * @param {object} options - Object with orchestrator options.
 * @param {string} [options.abtOptions=null] - Optional
 * @param {string} [options.articleUrl=null] - Optional article URL.
 * @param {string} [options.format='configArray'] - Optional format.
 * @param {string} [options.product='wsj'] - Optional product.
 * @param {object} [options.query={}] - Optional query parameters.
 * @param {string} [options.query.adsManifestType='default'] - Optional ads manifest type.
 * @param {object} [options.req={}] - Optional request object.
 * @param {object} [options.entitlements={}] - Entitlements data.
 * @param {boolean} [options.isB2BAuth=false] - Flag for B2B authentication.
 * @param {string} [options.path] - The path where the user is.
 * @returns {object} Ad tech scripts configuration.
 */
export const getOrchestratorScripts = (options = {}) => {
  const {
    abtOptions = {},
    articleUrl = null,
    format = 'configArray',
    product = DEFAULT_SITE,
    query = {},
    req = {},
    isB2BAuth = false,
    path,
  } = options;

  const { adsManifestType = 'default' } = query;
  const { cookies = {} } = req;

  abtOptions.type = isASection(abtOptions) ? SECTION_ABT_TYPE : ARTICLE_ABT_TYPE;
  abtOptions.site = abtOptions.product || product || DEFAULT_SITE;

  const entitlementsData = isB2BAuth ? getEntitlementsDataForB2BAuth(path) : getEntitlementsDataForB2CAuth;

  return orchestrator({
    abtOptions,
    format,
    product,
    scriptControlOptions: {
      cookies,
      proximicUrlParam: articleUrl,
      query,
      entitlements: entitlementsData,
    },
    type: adsManifestType,
    useSSR: true,
  });
};

export default getOrchestratorScripts;
