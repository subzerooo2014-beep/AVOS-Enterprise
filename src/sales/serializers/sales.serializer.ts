export class SalesSerializer {
  static item(item: any): any {
    if (!item) return null;

    return {
      ...item,
      createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : item.createdAt,
      updatedAt: item.updatedAt instanceof Date ? item.updatedAt.toISOString() : item.updatedAt,
    };
  }

  static collection(items: any[]): any[] {
    return Array.isArray(items) ? items.map((item) => this.item(item)) : [];
  }
}
