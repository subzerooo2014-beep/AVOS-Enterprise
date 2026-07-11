import { Injectable } from "@nestjs/common";

@Injectable()
export class ToolExecutorService {
  execute(tool: string, payload: any) {
    return {
      tool,
      payload,
      status: "EXECUTED",
      timestamp: new Date().toISOString(),
    };
  }
}
