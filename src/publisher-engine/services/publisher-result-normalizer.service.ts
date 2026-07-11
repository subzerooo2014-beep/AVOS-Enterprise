import { Injectable } from "@nestjs/common";
import { PublisherResult } from "../contracts/publisher.types";

@Injectable()
export class PublisherResultNormalizerService {
  normalize(channel: string, result: PublisherResult): PublisherResult {
    return {
      status: result.status ?? "published",
      channel: result.channel ?? channel,
      externalId: result.externalId ?? null,
      message: result.message ?? "Publisher executed.",
      metadata: result.metadata ?? {},
    };
  }
}
