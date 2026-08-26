// Basic email shape check.
export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// Normalize a cc/bcc field into a clean string[] (or undefined).
// Accepts an already-array value, a plain string, or a JSON-array string.
export function toArray(value: unknown): string[] | undefined {
  if (value == null) return undefined;
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) ? parsed.map(String) : [trimmed];
      } catch {
        return [trimmed];
      }
    }
    return [trimmed];
  }
  return undefined;
}
