import { Injectable } from "@nestjs/common";
@Injectable()
export class PluginSdkRuntime {
  execute(input: Record<string, unknown>) {
    return { id: "plugin-sdk_"+Date.now(), input, status: "COMPLETED" };
  }
}
