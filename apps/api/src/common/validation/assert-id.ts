export function assertId(id: string) {
  if (!id || typeof id !== "string") {
    throw new Error("Invalid id");
  }
}
