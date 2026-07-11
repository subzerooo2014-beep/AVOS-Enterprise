import { Injectable } from "@nestjs/common";

@Injectable()
export class PurchaseOrderItemsMapper {

 toCreateData(dto:any){

  return {

   purchaseOrderId:dto.purchaseOrderId,

   productId:dto.productId,

   quantity:dto.quantity,

   cost:dto.cost,

  };

 }

}
