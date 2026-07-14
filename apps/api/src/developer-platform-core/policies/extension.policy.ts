import { Injectable } from "@nestjs/common";
@Injectable()
export class ExtensionPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) throw new Error("Invalid extension input");
    return true;
  }
}
