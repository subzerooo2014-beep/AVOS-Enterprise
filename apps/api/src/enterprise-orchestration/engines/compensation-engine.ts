import { Injectable } from "@nestjs/common";

@Injectable()
export class CompensationEngine {
  compensate(input: any) {
    return {
      success: true,
      action: "COMPENSATED",
      input,
    };
  }
}
