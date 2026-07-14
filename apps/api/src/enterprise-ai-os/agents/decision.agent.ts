import { Injectable } from "@nestjs/common";
@Injectable()
export class DecisionAgent {
  execute(options: Array<Record<string, unknown>>) {
    return {
      selectedIndex: options.length ? 0 : -1,
      confidence: options.length ? 70 : 0,
      options,
    };
  }
}
