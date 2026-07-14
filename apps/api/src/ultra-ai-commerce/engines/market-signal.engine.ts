import { Injectable } from "@nestjs/common";

@Injectable()
export class MarketSignalEngine {
  score(signals: number[]) {
    const value = signals.length ? signals.reduce((a, b) => a + b, 0) / signals.length : 50;
    return { signalScore: Math.round(value), label: value >= 65 ? "STRONG" : value >= 45 ? "NEUTRAL" : "WEAK" };
  }
}
