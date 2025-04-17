/* eslint-disable sort-keys, react/destructuring-assignment */
import { dataProvider } from '@newscorp-djcs/sonata-core/common/data-provider';

import capitalizeDashed from '@/src/utils/capitalizeDashed';
import indexArrayByKey from '@/src/utils/indexArrayByKey';

const Section = () => {
  return <div></div>;
};

export const getServerSideProps = async ({ params: { page = '1', section = '' } = {} }) => {
  const keywords = [capitalizeDashed(section)];

  // Request data serverside by calling dataProvider with a data type and query
  const footerLinks = await dataProvider('footerLinks', 'na,us',  { navigationBrand: 'US_WSJ' }) || [];
  const navData = indexArrayByKey(await dataProvider('navData', ['fnews_topnav', 'fnews_hamnav']), 'id');
  
  const response = await dataProvider('keywords', { keywords: JSON.stringify(keywords), page, product: 'FN Online' });

  return {
    props: {
      footerLinks,
      navData,
      search: { [keywords]: response },
      entitlements: {
        forceRedirect: false,
        isArticle: false,
        entitlementsUrl: process.env.WEB_PLATFORM_ENTITLEMENTS,
      },
    },
  };
};

export default Section;
