import { Injectable } from "@nestjs/common";
@Injectable()
export class ChannelPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) throw new Error("Invalid channel input");
    return true;
  }
}
