import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherContentValidatorService {
  validate(job: any) {
    const errors: string[] = [];

    if (!job?.title || String(job.title).trim().length < 2) {
      errors.push("title is required");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
