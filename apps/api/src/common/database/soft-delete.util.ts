export function softDeleteData() {
  return {
    deletedAt: new Date(),
    isDeleted: true,
  };
}
