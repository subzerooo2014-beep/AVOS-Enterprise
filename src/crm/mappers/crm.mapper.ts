export class CrmMapper {
  static clean(data: any): any {
    const out: any = {};

    for (const [key, value] of Object.entries(data ?? {})) {
      if (value !== undefined && value !== null && value !== "") {
        out[key] = value;
      }
    }

    return out;
  }

  static toCreate(dto: any): any {
    return this.clean({
      ...dto,
      status: dto?.status ?? "NEW",
    });
  }

  static toUpdate(dto: any): any {
    return this.clean(dto);
  }
}
