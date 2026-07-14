import { Injectable } from "@nestjs/common";
@Injectable()
export class IotConnector {
  execute(operation:string,payload:Record<string,unknown>) {
    return {
      id: "iot_execution_"+Date.now(),
      connector: "iot",
      operation,
      payload,
      status: "COMPLETED",
      sandbox: true,
    };
  }
}
