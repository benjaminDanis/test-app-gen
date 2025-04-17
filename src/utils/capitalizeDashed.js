const capitalizeDashed = (str) => {
  return str?.replace(/^[a-z]|-[a-z]/g, (m) => {
    return m[1] ? ` ${m[1].toUpperCase()}` : m[0].toUpperCase();
  });
};

export default capitalizeDashed;
