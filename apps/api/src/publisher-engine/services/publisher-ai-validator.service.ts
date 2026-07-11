import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherAiValidatorService {
  validate(job: any) {
    return {
      success: true,
      valid: !!job?.title,
      warnings: [],
    };
  }
}
