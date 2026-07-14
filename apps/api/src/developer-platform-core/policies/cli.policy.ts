import { Injectable } from "@nestjs/common";
@Injectable()
export class CliPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) throw new Error("Invalid cli input");
    return true;
  }
}
