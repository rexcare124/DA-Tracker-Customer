// Helper function to convert snake_case keys to camelCase
export function convertObjectKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(convertObjectKeys);
  } else if (obj !== null && typeof obj === "object") {
    const converted: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      converted[camelKey] = convertObjectKeys(value);
    }
    return converted;
  }
  return obj;
}
