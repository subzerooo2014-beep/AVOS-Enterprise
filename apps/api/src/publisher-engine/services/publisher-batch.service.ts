import { Injectable } from "@nestjs/common";
import { PublisherJobWriterService } from "./publisher-job-writer.service";

@Injectable()
export class PublisherBatchService {
  constructor(private readonly writer: PublisherJobWriterService) {}

  async enqueueMany(items: any[]) {
    const created = [];

    for (const item of items) {
      created.push(await this.writer.create(item));
    }

    return {
      success: true,
      created: created.length,
      jobs: created,
    };
  }
}
