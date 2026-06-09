export const parseArrayField = (value: any): string[] | undefined => {
  if (!value) {
    return undefined;
  }

  // Already an array
  if (Array.isArray(value)) {
    return value;
  }

  // Single email entered in swagger
  if (
    typeof value === 'string' &&
    !value.startsWith('[')
  ) {
    return [value];
  }

  // JSON string array
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return [value];
    }
  }

  return undefined;
}