import { Injectable } from "@nestjs/common";
@Injectable()
export class CredentialPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) throw new Error("Invalid credential input");
    return true;
  }
}
