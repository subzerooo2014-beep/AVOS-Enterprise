import { Injectable } from "@nestjs/common";
@Injectable()
export class ApiPlaygroundRuntime {
  execute(input: Record<string, unknown>) {
    return { id: "api-playground_"+Date.now(), input, status: "COMPLETED" };
  }
}
