import { Injectable } from "@nestjs/common";

@Injectable()
export class InventoryTransactionsMapper {

  toCreateData(dto:any){

    return {

      productId:dto.productId,

      warehouseId:dto.warehouseId,

      type:dto.type,

      quantity:dto.quantity,

      reference:dto.reference,

      notes:dto.notes,

    };

  }

}
