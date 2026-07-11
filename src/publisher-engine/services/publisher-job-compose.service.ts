import { Injectable } from "@nestjs/common";
import { PublisherContentNormalizerService } from "./publisher-content-normalizer.service";
import { PublisherContentValidatorService } from "./publisher-content-validator.service";
import { PublisherPayloadBuilderService } from "./publisher-payload-builder.service";

@Injectable()
export class PublisherJobComposeService {
  constructor(
    private readonly normalizer: PublisherContentNormalizerService,
    private readonly validator: PublisherContentValidatorService,
    private readonly payload: PublisherPayloadBuilderService,
  ) {}

  compose(job: any) {
    const normalized = this.normalizer.normalize(job);
    const validation = this.validator.validate(normalized);

    return {
      valid: validation.valid,
      errors: validation.errors,
      job: normalized,
      payload: this.payload.build(normalized),
    };
  }
}
