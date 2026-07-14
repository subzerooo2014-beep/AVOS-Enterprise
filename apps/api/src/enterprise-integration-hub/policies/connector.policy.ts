import { Injectable } from "@nestjs/common";
@Injectable()
export class ConnectorPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) throw new Error("Invalid connector input");
    return true;
  }
}
