import { Injectable } from "@nestjs/common";
@Injectable()
export class MarketAgent {
  execute(values: number[]) {
    const average = values.length
      ? values.reduce((sum, value) => sum + value, 0) / values.length
      : 0;
    return { average, count: values.length };
  }
}
