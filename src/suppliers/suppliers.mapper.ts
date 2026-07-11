import { Injectable } from "@nestjs/common";
import { CreateSupplierDto } from "./dto/create-supplier.dto";
import { UpdateSupplierDto } from "./dto/update-supplier.dto";

@Injectable()
export class SuppliersMapper {
  toCreateData(dto: CreateSupplierDto) {
    return {
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      address: dto.address,
      notes: dto.notes,
    };
  }

  toUpdateData(dto: UpdateSupplierDto) {
    return {
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      address: dto.address,
      notes: dto.notes,
    };
  }
}
