export const sanitizeText = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/[<>]/g, '')
    .trim();
};

export const isRateLimited = (key: string, limitCount: number = 5, windowMs: number = 60000): boolean => {
  try {
    const now = Date.now();
    const raw = localStorage.getItem(`rate_limit_${key}`);
    const timestamps: number[] = raw ? JSON.parse(raw) : [];
    const valid = timestamps.filter(t => now - t < windowMs);

    if (valid.length >= limitCount) {
      return true;
    }

    valid.push(now);
    localStorage.setItem(`rate_limit_${key}`, JSON.stringify(valid));
    return false;
  } catch {
    return false;
  }
};
