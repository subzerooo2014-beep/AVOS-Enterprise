import { Injectable } from "@nestjs/common";
@Injectable()
export class DataSourcePolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) throw new Error("Invalid data-source input");
    return true;
  }
}
