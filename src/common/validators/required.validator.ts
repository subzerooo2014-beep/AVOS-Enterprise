export function validateRequired(value: unknown, field: string) {
  if (value === undefined || value === null || value === "") {
    throw new Error(`${field} is required`);
  }
}
