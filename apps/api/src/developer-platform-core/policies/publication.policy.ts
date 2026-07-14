import { Injectable } from "@nestjs/common";
@Injectable()
export class PublicationPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) throw new Error("Invalid publication input");
    return true;
  }
}
