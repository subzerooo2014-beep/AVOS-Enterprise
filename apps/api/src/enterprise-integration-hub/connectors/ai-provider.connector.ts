import { Injectable } from "@nestjs/common";
@Injectable()
export class AiProviderConnector {
  execute(operation:string,payload:Record<string,unknown>) {
    return {
      id: "ai-provider_execution_"+Date.now(),
      connector: "ai-provider",
      operation,
      payload,
      status: "COMPLETED",
      sandbox: true,
    };
  }
}
