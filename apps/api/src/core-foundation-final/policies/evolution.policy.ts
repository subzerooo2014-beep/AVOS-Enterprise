import { Injectable } from "@nestjs/common";

@Injectable()
export class EvolutionPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) {
      throw new Error("Invalid evolution input");
    }
    return true;
  }
}
