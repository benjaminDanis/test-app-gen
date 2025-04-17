/* eslint-disable no-param-reassign */
const indexArrayByKey = (list, iteratee) => {
  try {
    return list.reduce((accum, item) => {
      if (Object.hasOwnProperty.call(item, iteratee)) {
        accum[item[iteratee]] = item;
      }
      return accum;
    }, {});
  } catch (e) {
    return {};
  }
};

export default indexArrayByKey;
