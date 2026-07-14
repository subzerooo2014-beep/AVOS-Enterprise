import { Injectable } from "@nestjs/common";
import { PublicationPolicy } from "../policies/publication.policy";
@Injectable()
export class PublicationService {
  constructor(private readonly policy: PublicationPolicy) {}
  publish(journeyId: string, channels: string[]) {
    this.policy.validate(channels);
    return channels.map((channel) => ({
      id: `pub_${Date.now()}_${channel}`,
      journeyId,
      channel,
      status: "PUBLISHED",
      publishedAt: new Date().toISOString(),
    }));
  }
}
