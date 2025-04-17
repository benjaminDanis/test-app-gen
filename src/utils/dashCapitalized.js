const dashCapitalized = (capitalized) => {
  return capitalized.replace(/^[A-Z]| [A-Z]/g, (m) => (m[1] ? `-${m[1].toLowerCase()}` : m[0].toLowerCase()));
};

export default dashCapitalized;
