import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherContentNormalizerService {
  normalize(job: any) {
    return {
      ...job,
      title: String(job.title ?? "").trim(),
      content: job.content ? String(job.content).trim() : null,
    };
  }
}
