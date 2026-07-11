import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobClockService {
  now() {
    return new Date();
  }

  unix() {
    return Date.now();
  }
}
