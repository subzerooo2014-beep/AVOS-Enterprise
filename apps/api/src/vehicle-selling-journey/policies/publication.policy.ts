import { Injectable } from "@nestjs/common";
@Injectable()
export class PublicationPolicy {
  validate(channels: string[]) {
    if (!channels.length) throw new Error("Select at least one publication channel");
    return true;
  }
}
