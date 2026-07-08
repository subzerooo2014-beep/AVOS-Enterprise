export class SalesMapper {
  static clean(data: any): any {
    const out: any = {};

    for (const [key, value] of Object.entries(data ?? {})) {
      if (value !== undefined && value !== null && value !== '') {
        out[key] = value;
      }
    }

    return out;
  }

  static toCreate(dto: any): any {
    return this.clean({
      ...dto,
      number: dto?.number,
      status: dto?.status ?? 'OPEN',
      total: Number(dto?.total ?? 0),
    });
  }

  static toUpdate(dto: any): any {
    return this.clean({
      ...dto,
      total: dto?.total !== undefined ? Number(dto.total) : undefined,
    });
  }
}
