import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherEngineReadyService {
  ready() {
    return {
      success: true,
      ready: true,
      checkedAt: new Date(),
    };
  }
}
