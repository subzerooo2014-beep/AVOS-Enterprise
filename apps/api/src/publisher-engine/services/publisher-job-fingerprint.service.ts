import { Injectable } from "@nestjs/common";
import { createHash } from "crypto";

@Injectable()
export class PublisherJobFingerprintService {
  make(job: any) {
    return createHash("sha256")
      .update(JSON.stringify({
        title: job?.title,
        content: job?.content,
        campaignId: job?.campaignId,
        channelId: job?.channelId,
      }))
      .digest("hex");
  }
}
