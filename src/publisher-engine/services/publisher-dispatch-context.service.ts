import { Injectable } from "@nestjs/common";
import { PublisherContextBuilderService } from "./publisher-context-builder.service";

@Injectable()
export class PublisherDispatchContextService {
  constructor(
    private readonly builder: PublisherContextBuilderService,
  ) {}

  create(job: any) {
    return this.builder.build(job);
  }
}
