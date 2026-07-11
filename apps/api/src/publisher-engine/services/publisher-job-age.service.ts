import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobAgeService {
  age(job: any) {
    if (!job?.createdAt) {
      return 0;
    }

    return Date.now() - new Date(job.createdAt).getTime();
  }
}
