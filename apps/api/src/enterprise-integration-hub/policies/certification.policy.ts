import { Injectable } from "@nestjs/common";
@Injectable()
export class CertificationPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) throw new Error("Invalid certification input");
    return true;
  }
}
