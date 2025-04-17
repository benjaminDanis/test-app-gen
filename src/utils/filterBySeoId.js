const {
  env: { NODE_ENV },
} = process;

const filterBySeoId = (id) => {
  // Regex to match by 2-100 iterations of characters (a-z, 0-9, $) and a dash
  // and an eigth digit date format string (yyyymmdd),
  // where the first y, m, and d digits are a number between 0 & 3.
  const regex =
    NODE_ENV === 'development'
      ? /^(?:(?:[a-z]|[0-9]|\$|£)*-){2,100}(?:[0-3]){1}(?:[0-9]){3}(?:[0-3]){1}(?:[0-9]){1}(?:[0-3]){1}(?:[0-9]){1}(?:_PROD_)?$/
      : /^(?:(?:[a-z]|[0-9]|\$|£)*-){2,100}(?:[0-3]){1}(?:[0-9]){3}(?:[0-3]){1}(?:[0-9]){1}(?:[0-3]){1}(?:[0-9]){1}$/;
  const [match] = id.match(regex) || [];

  if (match) {
    return true;
  }

  return false;
};

export default filterBySeoId;
