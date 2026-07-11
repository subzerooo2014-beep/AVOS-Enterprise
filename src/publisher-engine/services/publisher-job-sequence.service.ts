import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobSequenceService {
  private sequence = 0;

  next() {
    this.sequence++;
    return this.sequence;
  }

  current() {
    return this.sequence;
  }

  reset() {
    this.sequence = 0;
  }
}
