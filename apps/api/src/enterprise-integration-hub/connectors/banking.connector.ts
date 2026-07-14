import { Injectable } from "@nestjs/common";
@Injectable()
export class BankingConnector {
  execute(operation:string,payload:Record<string,unknown>) {
    return {
      id: "banking_execution_"+Date.now(),
      connector: "banking",
      operation,
      payload,
      status: "COMPLETED",
      sandbox: true,
    };
  }
}
