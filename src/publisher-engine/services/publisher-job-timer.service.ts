import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobTimerService {
  start() {
    return process.hrtime.bigint();
  }

  stop(start: bigint) {
    return Number(process.hrtime.bigint() - start) / 1_000_000;
  }
}
