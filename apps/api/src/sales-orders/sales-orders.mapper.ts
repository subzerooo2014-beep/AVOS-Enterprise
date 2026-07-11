import { Injectable } from "@nestjs/common";

@Injectable()
export class SalesOrdersMapper {

  toCreateData(dto:any){

    return {
      customerId:dto.customerId,
      status:dto.status ?? "DRAFT",
      totalAmount:dto.totalAmount ?? 0,
    };

  }

  toUpdateData(dto:any){

    return {
      status:dto.status,
      totalAmount:dto.totalAmount,
    };

  }

}
