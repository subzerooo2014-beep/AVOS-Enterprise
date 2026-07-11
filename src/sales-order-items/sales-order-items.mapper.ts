import { Injectable } from "@nestjs/common";

@Injectable()
export class SalesOrderItemsMapper {

 toCreateData(dto:any){

  return {

   salesOrderId:dto.salesOrderId,

   productId:dto.productId,

   quantity:dto.quantity,

   unitPrice:dto.unitPrice,

  };

 }

}
