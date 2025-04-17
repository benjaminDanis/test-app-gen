/* eslint-disable sort-keys, react/destructuring-assignment */
import { UniversalArticleComponent, UniversalArticleComponentContextProvider } from '@newscorp-djcs/sonata-react';
import { EmbedExpandProvider } from '@newscorp-ghfb/dj-capi-article';
import { TextScaleProvider, ViewportsProvider } from '@newscorp-ghfb/dj-shared-functions';
import PropTypes from 'prop-types';
import { useMemo } from 'react';

import { prepareArticleData } from '@/src/utils/prepareArticleData';

export const Article = ({ article, disableAds, adsConfig, asideContentRef }) => {
  const transformedData = useMemo(() => prepareArticleData(article), [article]);

  const localStorageKeyTextScale = 'dj-spa-platform.article.textScale';

  if (!transformedData) {
    return null;
  }

  // Uncomment and use thi handler if needed
  /*   
  const utilityBarShareHandler = (itemKey) => {
    if (itemKey === 'email') {
      // add email handler function here
    }
  }; 
  */

  const articleBodyCustomComponents = {};

  const disabledComponents = {};

  const universalArticleCustomComponents = {};

  const textScaleProps = {
    // resizeIcon: ResizeIcon,
    // resizeIconLarge: ResizeIconLarge,
    // resizeIconMedium: ResizeIconMedium,
    // resizeIconSmall: ResizeIconSmall,
  };

  const utilityBarCustomProps = {
    // shareIcon: ShareIcon,
    shareToolsTitle: 'Share',
    // shareOptions: options,
    shouldHideSaveArticle: false,
    shouldShowGiftButton: false,
    shouldDisplayTranslationButton: false,
    // shareHandler: utilityBarShareHandler,
    // TranslationButton: (props) => <SimplifiedTranslationButton {...props} />,
    hasTranslationDivider: false,
    ...textScaleProps,
  };
  const universalArticleProps = {
    ...transformedData,
    disableAds,
    disbleBredcrumbs: true,
    disableClientData: true,
    customBrandLogos: {},
    articleBodyCustomComponents,
    universalArticleCustomComponents,
    disabledComponents,
    utilityBarCustomProps,
    adsConfig
  };

  return (
    <ViewportsProvider>
      <EmbedExpandProvider>
        <UniversalArticleComponentContextProvider articleData={universalArticleProps}>
          <TextScaleProvider localStorageKey={localStorageKeyTextScale}>
            <UniversalArticleComponent asideContentRef={asideContentRef} />
          </TextScaleProvider>
        </UniversalArticleComponentContextProvider>
      </EmbedExpandProvider>
    </ViewportsProvider>
  );
};

Article.propTypes = {
  article: PropTypes.object.isRequired,
  disableAds: PropTypes.bool,
  adsConfig: PropTypes.object,
  asideContentRef: PropTypes.object,
};

export default Article;
