import { Injectable } from "@nestjs/common";
@Injectable()
export class ModelRouterRuntime {
  execute(input: Record<string, unknown>) {
    return { id: "model-router_"+Date.now(), input, status: "COMPLETED" };
  }
}
