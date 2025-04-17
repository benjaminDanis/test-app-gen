export const prepareArticleData = (article) => {
  if (!article) {
    return article;
  }

  const headline = article?.headline?.text;
  const dek = article?.standFirst?.content?.text;
  const {
    authors,
    liveDateTimeUtc: latestChangeTime,
    product,
    sectionName,
    sourceUrl: articleFullUrl,
    seoId,
  } = article || {};

  const articleData = {
    continuousFlowEnabled: false,
    endpoints: {},
    articleBody: article?.articleBody,
    headline,
    dek,
    latestChangeTime,
    authors,
    product,
    template: 'standard',
    articleData: {
      ...article,
      articleSection: sectionName,
      articleUrl: seoId,
      articleFullUrl,
    },
  };

  return articleData;
};
