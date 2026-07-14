import { Injectable } from "@nestjs/common";

@Injectable()
export class ConstitutionPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) {
      throw new Error("Invalid constitution input");
    }
    return true;
  }
}
