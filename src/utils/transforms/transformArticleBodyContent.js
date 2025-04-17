export const transformArticleBodyContent = (articleBody = []) => {
  const transformedArticleBody = [...articleBody]?.map((item) => {
    let updatedItem = { ...item };
    const { type, inset_type } = updatedItem;

    if (type === 'inset' && inset_type === 'pullquote') {
      const updatedContent = updatedItem?.content?.map((it, index) => {
        let transformedItem = { ...it };

        if (index === 0) {
          // quote characters have been added
          const quotedText = `“${it.content[0].text}”`;
          const newContent = transformedItem?.content?.map((it, index) => {
            if (index === 0) {
              return {
                ...it,
                text: quotedText,
              };
            }

            return it;
          });
          transformedItem = {
            ...transformedItem,
            content: newContent,
          };
        }

        return transformedItem;
      });

      updatedItem = {
        ...updatedItem,
        content: updatedContent,
        className: 'articleBody_pullquote_block',
      };
    }

    if (type === 'inset' && inset_type === 'tweet') {
      updatedItem = {
        ...updatedItem,
        className: 'articleBody_tweet_block',
      };
    }

    return updatedItem;
  });

  return transformedArticleBody;
};

export default transformArticleBodyContent;
