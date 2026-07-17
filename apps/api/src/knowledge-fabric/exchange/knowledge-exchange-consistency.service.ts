import { Injectable } from "@nestjs/common";
import { KnowledgeExchangeConsistency, KnowledgeExchangeChannel } from "./knowledge-exchange.types";

@Injectable()
export class KnowledgeExchangeConsistencyService {
  evaluate(channel: KnowledgeExchangeChannel, operation: "READ" | "WRITE" | "SYNC") {
    const writable = channel.state === "ACTIVE";
    const allowed = operation === "READ" ? channel.state !== "SUSPENDED" : writable;
    return {
      allowed,
      consistency: channel.consistency as KnowledgeExchangeConsistency,
      channelState: channel.state,
      evaluatedAt: new Date().toISOString(),
    };
  }
}