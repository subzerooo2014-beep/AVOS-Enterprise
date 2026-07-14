import { Injectable } from "@nestjs/common";

@Injectable()
export class DictionaryPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) {
      throw new Error("Invalid dictionary input");
    }
    return true;
  }
}
