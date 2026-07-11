export class CustomersSerializer {
  static serialize(data: any) {
    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  static serializeMany(items: any[] = []) {
    return items.map((item) => this.serialize(item));
  }

  static serializePagination(result: any) {
    return {
      data: this.serializeMany(result.data ?? []),
      meta: {
        total: result.total ?? 0,
        page: result.page ?? 1,
        limit: result.limit ?? 20,
        totalPages: result.totalPages ?? 1,
      },
    };
  }
}
