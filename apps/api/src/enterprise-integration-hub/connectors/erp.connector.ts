import { Injectable } from "@nestjs/common";
@Injectable()
export class ErpConnector {
  execute(operation:string,payload:Record<string,unknown>) {
    return {
      id: "erp_execution_"+Date.now(),
      connector: "erp",
      operation,
      payload,
      status: "COMPLETED",
      sandbox: true,
    };
  }
}
