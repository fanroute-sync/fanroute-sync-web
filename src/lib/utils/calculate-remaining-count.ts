export function calculateRemainingCount(used: number, limit: number) {
  return Math.max(limit - used, 0);
}
