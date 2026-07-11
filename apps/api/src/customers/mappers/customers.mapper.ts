export class CustomersMapper {
  static toResponse(entity: any) {
    if (!entity) return null;

    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      phone: entity.phone,
      company: entity.company,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toResponseList(items: any[] = []) {
    return items.map((item) => this.toResponse(item));
  }

  static toCreate(data: any) {
    return {
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      status: data.status,
    };
  }

  static toUpdate(data: any) {
    return {
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      status: data.status,
    };
  }
}
