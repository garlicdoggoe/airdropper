export const calculateTotal = (input: string): number => {
  // Return 0 if input is empty
  if (!input.trim()) {
    return 0;
  }

  // Split the input string by both commas and newlines
  const amountArray = input
    .split(/[\n,]+/)
    .map(amt => amt.trim())
    .filter(amt => amt.length > 0)
    .map(amt => parseFloat(amt));

  // Sum all the numbers
  return amountArray
    .filter(num => !isNaN(num))
    .reduce((sum, num) => sum + num, 0);
};
