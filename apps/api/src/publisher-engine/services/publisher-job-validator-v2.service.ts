import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobValidatorV2Service {
  validate(job: any) {
    const errors: string[] = [];

    if (!job?.title) errors.push("Missing title");
    if (!job?.status) errors.push("Missing status");
    if (!job?.priority) errors.push("Missing priority");

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
