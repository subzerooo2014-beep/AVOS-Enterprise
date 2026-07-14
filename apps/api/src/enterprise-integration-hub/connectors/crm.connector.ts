import { Injectable } from "@nestjs/common";
@Injectable()
export class CrmConnector {
  execute(operation:string,payload:Record<string,unknown>) {
    return {
      id: "crm_execution_"+Date.now(),
      connector: "crm",
      operation,
      payload,
      status: "COMPLETED",
      sandbox: true,
    };
  }
}
