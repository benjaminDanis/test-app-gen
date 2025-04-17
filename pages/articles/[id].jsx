import { dataProvider } from '@newscorp-djcs/sonata-core/common/data-provider';
import { getAdOptionsForArticle } from '@newscorp-djcs/sonata-core/server/utils';
import PropTypes from 'prop-types';
import { useRef } from 'react';


import UniversalArticleComponent from '@/src/components/Article';
import { Grid } from '@/src/components/Grid';
import { GridItem } from '@/src/components/Grid/GridItem';
import getAdsConfiguration from '@/src/data/fetchers/ads';
import { DEFAULT_SITE, ENDPOINTS } from '@/src/utils/constants';
import { encryptArticle } from '@/src/utils/crypto';
import indexArrayByKey from '@/src/utils/indexArrayByKey';
import { transformArticleBodyContent } from '@/src/utils/transforms';

const Article = (props) => {
  const {
    article,
    disableAds,
    adsConfig
  } = props;

  const asideContentRef = useRef(null);

  return (
    <Grid name="article" className="article">
      <GridItem area="article_header" className="article_header">
       Page Header Block
      </GridItem>
      <GridItem area="article_left">
        Page Left Block
      </GridItem>
      <GridItem area="article_main">
        <UniversalArticleComponent
          article={article}
          disableAds={disableAds}
          adsConfig={adsConfig}
          asideContentRef={asideContentRef}
        />
      </GridItem>
      <GridItem area="article_right">
        <div ref={asideContentRef}>
          <div style={{ height: '850px'}}>Aside placeholder</div>
        </div>
      </GridItem>
    </Grid>
  );
};

async function getAdPlacementConfigs(article, disableAds) {
  let adsConfig = null;
  if(!disableAds) {
    const adOptions = getAdOptionsForArticle({
      l1: article?.sectionName,
      l2: article?.sectionType,
      pageid: article?.upstreamOriginId,
      product: DEFAULT_SITE,
      url: article?.url,
    });
    adsConfig = await getAdsConfiguration(adOptions);
  }
  return adsConfig;
}

export const getServerSideProps = async ({ params: { id = '' } = {} }) => {
  // Request data serverside by calling dataProvider with a data type and query
  const response = (await dataProvider('article', id)) || {};
  const { article = {} } = response;
  const { articleBody } = article;

  const transformedArticleBody = transformArticleBodyContent(articleBody);

  const { encryptedDocumentKey, ...encryptedDataHash } = await encryptArticle(transformedArticleBody || []);


  if (!article) {
    return {
      notFound: true,
    };
  }

  const footerLinks = await dataProvider('footerLinks', 'na,us', { navigationBrand: 'US_WSJ' }) || [];
  const navData = indexArrayByKey(await dataProvider('navData', ['fnews_topnav', 'fnews_hamnav']), 'id');
  const disableAds = process.env.DISABLE_ADS === 'true';
  const adsConfig = await getAdPlacementConfigs(article, disableAds);
  return {
    props: JSON.parse(JSON.stringify({
      article,
      disableAds,
      adsConfig,
      footerLinks,
      navData,
      encryption: {
        dataHash: encryptedDataHash,
        documentKey: encryptedDocumentKey,
      },
      entitlements: {
        forceRedirect: false,
        isArticle: true,
        entitlementsUrl: process.env.WEB_PLATFORM_ENTITLEMENTS,
      },
      endpoints: ENDPOINTS,
    })),
  };
};

Article.propTypes = {
  article: PropTypes.object.isRequired,
  disableAds: PropTypes.bool,
  adsConfig: PropTypes.object,
};

export default Article;
