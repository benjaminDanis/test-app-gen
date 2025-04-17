import { UniversalAdComponent } from '@ace/components-react';
import { dataProvider } from '@newscorp-djcs/sonata-core/common/data-provider';
import { getAdOptionsForSection } from '@newscorp-djcs/sonata-core/server/utils';
import Head from 'next/head';
import Image from 'next/image';

import getAdsConfiguration from '@/src/data/fetchers/ads';
import { getOrchestratorScripts } from '@/src/services/orchestrator';
import { DEFAULT_SITE, ENDPOINTS, HOMEPAGE_BANNER_LOCATION, HOMEPAGE_L1 } from '@/src/utils/constants';
import indexArrayByKey from '@/src/utils/indexArrayByKey';
import styles from '@/styles/Home.module.css';

const Home = (pageProps) => {

  const { disableAds } = pageProps;

  return (
    <>
      <Head />
      <main className={styles.main}>
        {!disableAds &&
          <UniversalAdComponent
            options={{
              ...pageProps.adsConfigs[HOMEPAGE_BANNER_LOCATION],
              isObserve: true,
              threshold: 0,
              rootMargin: '0px 0px 250px 0px',
              labelClasses: 'body-ad-label',
              staticHeight: { defaultHeight: '250px' },
            }}
          />
        }
        <div className={styles.center}>
          <Image className={styles.logo} src="/next.svg" alt="Next.js Logo" width={180} height={37} priority />
          <div className={styles.thirteen}>
            <Image src="/thirteen.svg" alt="13" width={40} height={31} priority />
          </div>
        </div>
      </main>
    </>
  );
};

export const getServerSideProps = async ({ req, resolvedUrl }) => {
  const disableAds = process.env.DISABLE_ADS === 'true';
  const footerLinks = await dataProvider('footerLinks', 'na,us', { navigationBrand: 'US_WSJ' }) || [];

  const navData = indexArrayByKey(await dataProvider('navData', ['fnews_topnav', 'fnews_hamnav']), 'id');

  const adOptions = getAdOptionsForSection({ l1: HOMEPAGE_L1, l2: '', url: `https://${req.headers.host}${resolvedUrl}` });
  const adsConfigs = await getAdsConfiguration(adOptions);
  const aceScriptsConfig = getOrchestratorScripts({ abtOptions: adOptions, product: DEFAULT_SITE });

  return {
    props: {
      aceScriptsConfig,
      adsConfigs,
      disableAds,
      footerLinks,
      navData,
      entitlements: {
        forceRedirect: false,
        isArticle: false,
        entitlementsUrl: process.env.WEB_PLATFORM_ENTITLEMENTS,
      },
      endpoints: ENDPOINTS,
    },
  };
};

export default Home;
