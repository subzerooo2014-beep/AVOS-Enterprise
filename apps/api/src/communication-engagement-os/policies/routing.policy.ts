import { Injectable } from "@nestjs/common";
@Injectable()
export class RoutingPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) throw new Error("Invalid routing input");
    return true;
  }
}
