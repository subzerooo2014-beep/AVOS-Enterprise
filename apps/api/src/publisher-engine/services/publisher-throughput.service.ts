import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherThroughputService {
  throughput(processed: number, seconds: number) {
    if (seconds <= 0) {
      return 0;
    }

    return Number((processed / seconds).toFixed(2));
  }
}
