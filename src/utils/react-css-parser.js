const toCamelCase = (str) =>
  str.replace(/\w-\w/gi, (d) => `${d[0]}${d[2].toUpperCase()}`);

const parse = (code) => {
  const splitted = code.split(';');

  return splitted.reduce((acc, curr) => {
    if (!curr.includes(':')) return acc;

    const [key, value] = curr.trim().split(':');

    acc[toCamelCase(key.trim())] = value.trim();

    return acc;
  }, {});
};

export default parse;
