import { Injectable } from "@nestjs/common";
@Injectable()
export class CustomerAgent {
  execute(input: Record<string, unknown>) {
    return { profile: input, recommendations: [] };
  }
}
