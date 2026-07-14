import { Injectable } from "@nestjs/common";

@Injectable()
export class RtlLtrRuntime {
  execute(input: Record<string, unknown>) {
    return {
      id: "rtl-ltr_"+Date.now(),
      input,
      status: "COMPLETED",
    };
  }
}
