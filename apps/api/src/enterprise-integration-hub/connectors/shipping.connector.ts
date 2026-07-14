import { Injectable } from "@nestjs/common";
@Injectable()
export class ShippingConnector {
  execute(operation:string,payload:Record<string,unknown>) {
    return {
      id: "shipping_execution_"+Date.now(),
      connector: "shipping",
      operation,
      payload,
      status: "COMPLETED",
      sandbox: true,
    };
  }
}
