import { Injectable } from "@nestjs/common";
@Injectable()
export class ModerationPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) throw new Error("Invalid moderation input");
    return true;
  }
}
