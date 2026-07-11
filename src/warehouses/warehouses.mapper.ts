import { Injectable } from "@nestjs/common";

@Injectable()
export class WarehousesMapper {
  toCreateData(dto: any) {
    return {
      name: dto.name,
      code: dto.code,
      location: dto.location,
    };
  }

  toUpdateData(dto: any) {
    return {
      name: dto.name,
      code: dto.code,
      location: dto.location,
    };
  }
}
