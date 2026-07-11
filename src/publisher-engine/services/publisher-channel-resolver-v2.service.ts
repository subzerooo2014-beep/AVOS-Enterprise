import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherChannelResolverV2Service {
  resolve(job: any) {
    return (
      job?.result?.publisher?.channel ??
      job?.result?.channel ??
      job?.channel ??
      "internal"
    );
  }
}
