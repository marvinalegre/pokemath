export function generateAddition({ minSum = 1, maxSum = 10 } = {}) {
  const sum = Math.floor(Math.random() * (maxSum - minSum)) + minSum;
  const a = Math.floor(Math.random() * (sum - 1)) + 1;
  const b = sum - a;
  return {
    question: `${a} + ${b} = ?`,
    answer: String(sum),
  };
}
