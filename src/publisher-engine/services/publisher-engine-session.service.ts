import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";

@Injectable()
export class PublisherEngineSessionService {
  create() {
    return {
      sessionId: randomUUID(),
      createdAt: new Date(),
    };
  }
}
