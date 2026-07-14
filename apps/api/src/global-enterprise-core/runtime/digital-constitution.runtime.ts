import { Injectable } from "@nestjs/common";

@Injectable()
export class DigitalConstitutionRuntime {
  execute(input: Record<string, unknown>) {
    return {
      id: "digital-constitution_"+Date.now(),
      input,
      status: "COMPLETED",
    };
  }
}
