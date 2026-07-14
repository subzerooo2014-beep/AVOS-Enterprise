import { Injectable } from "@nestjs/common";
@Injectable()
export class SocialDistributionService {
  distribute(journeyId: string, channels: string[]) {
    return channels.map((channel) => ({ journeyId, channel, status: "QUEUED" }));
  }
}
