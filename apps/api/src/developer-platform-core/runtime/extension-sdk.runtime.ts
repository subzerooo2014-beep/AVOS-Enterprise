import { Injectable } from "@nestjs/common";
@Injectable()
export class ExtensionSdkRuntime {
  execute(input: Record<string, unknown>) {
    return { id: "extension-sdk_"+Date.now(), input, status: "COMPLETED" };
  }
}
