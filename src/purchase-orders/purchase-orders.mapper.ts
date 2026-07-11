import { Injectable } from "@nestjs/common";

@Injectable()
export class PurchaseOrdersMapper {

  toCreateData(dto:any){

    return {
      supplierId:dto.supplierId,
      status:dto.status ?? "DRAFT",
      total:dto.total ?? 0,
    };

  }

  toUpdateData(dto:any){

    return {
      status:dto.status,
      total:dto.total,
    };

  }

}
