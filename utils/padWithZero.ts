const padWithZero = (number: number) => {
  const string = number.toString();
  if (number < 10) {
    return "0" + string;
  }
  return string;
};

export default padWithZero;
