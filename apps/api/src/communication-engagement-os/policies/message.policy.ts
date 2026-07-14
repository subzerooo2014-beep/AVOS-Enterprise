import { Injectable } from "@nestjs/common";
@Injectable()
export class MessagePolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) throw new Error("Invalid message input");
    return true;
  }
}
