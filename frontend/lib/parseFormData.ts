/**
 * Helper function to parse form data
 */
export async function parseFormData(formData: FormData) {
  const entries: Record<string, any> = {};
  
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      entries[key] = value;
    } else {
      // Try to parse as JSON if possible
      try {
        entries[key] = JSON.parse(value as string);
      } catch (e) {
        entries[key] = value;
      }
    }
  }
  
  return entries;
}
