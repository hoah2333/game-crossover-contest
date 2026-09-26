export const shuffle = <T>(items: readonly T[], maxItems?: number): T[] => {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const current = shuffled[index];
    const swap = shuffled[swapIndex];
    if (current !== undefined && swap !== undefined) {
      shuffled[index] = swap;
      shuffled[swapIndex] = current;
    }
  }
  return maxItems === undefined ? shuffled : shuffled.slice(0, maxItems);
};
