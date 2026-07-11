import { Injectable } from "@nestjs/common";

@Injectable()
export class SalesWorkflowService {
  start(referenceId:string){
    return {
      event:"QUOTE_CREATED",
      referenceId,
      status:"STARTED",
      timestamp:new Date(),
    };
  }

  moveToOrder(referenceId:string){
    return {
      event:"ORDER_CREATED",
      referenceId,
      status:"ORDER_STAGE",
      timestamp:new Date(),
    };
  }

  moveToInvoice(referenceId:string){
    return {
      event:"INVOICE_CREATED",
      referenceId,
      status:"INVOICE_STAGE",
      timestamp:new Date(),
    };
  }
}
