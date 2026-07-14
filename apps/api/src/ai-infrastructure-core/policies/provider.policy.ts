import { Injectable } from "@nestjs/common";
@Injectable()
export class ProviderPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) throw new Error("Invalid provider input");
    return true;
  }
}
