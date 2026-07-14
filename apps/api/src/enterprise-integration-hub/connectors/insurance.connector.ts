import { Injectable } from "@nestjs/common";
@Injectable()
export class InsuranceConnector {
  execute(operation:string,payload:Record<string,unknown>) {
    return {
      id: "insurance_execution_"+Date.now(),
      connector: "insurance",
      operation,
      payload,
      status: "COMPLETED",
      sandbox: true,
    };
  }
}
