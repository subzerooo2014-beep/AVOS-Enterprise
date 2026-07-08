export function buildSearchFilter(search?: string, fields: string[] = []) {
  if (!search || fields.length === 0) return undefined;

  return {
    OR: fields.map((field) => ({
      [field]: {
        contains: search,
        mode: "insensitive",
      },
    })),
  };
}
