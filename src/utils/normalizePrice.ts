import reverseString from './reverseString';

const normalizePrice = (price: string): string => {
  price = price.toString();

  const [a, b = ''] = price.split('.');

  let newA = '';

  for (let i = 0; i < a.length; i++) {
    if (i && i % 3 === 0) {
      newA += ' ';
    }

    newA += a[a.length - 1 - i];
  }

  return `${reverseString(newA)}.${b}`;
};

export default normalizePrice;
