import { Injectable } from "@nestjs/common";
import { PublisherJobAgeService } from "./publisher-job-age.service";

@Injectable()
export class PublisherJobExpirationService {
  constructor(
    private readonly age: PublisherJobAgeService,
  ) {}

  expired(job: any, hours = 24) {
    return this.age.age(job) > hours * 60 * 60 * 1000;
  }
}
