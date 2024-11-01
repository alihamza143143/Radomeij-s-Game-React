export const logBase = (value: number, base: number): number => {
    return Math.log(value) / Math.log(base);
};

export function clampToZeroOne(value: number): number {
    return Math.min(Math.max(value, 0), 1);
  }
