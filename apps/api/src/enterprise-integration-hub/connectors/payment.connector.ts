import { Injectable } from "@nestjs/common";
@Injectable()
export class PaymentConnector {
  execute(operation:string,payload:Record<string,unknown>) {
    return {
      id: "payment_execution_"+Date.now(),
      connector: "payment",
      operation,
      payload,
      status: "COMPLETED",
      sandbox: true,
    };
  }
}
