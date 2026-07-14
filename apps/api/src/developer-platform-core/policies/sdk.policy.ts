import { Injectable } from "@nestjs/common";
@Injectable()
export class SdkPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) throw new Error("Invalid sdk input");
    return true;
  }
}
