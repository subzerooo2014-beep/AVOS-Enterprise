import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductExperienceComposerService {
  compose(productId: string, channels: string[]) {
    return {
      productId,
      channels: channels.map((channel) => ({
        channel,
        adaptiveExperience: true,
        accessibilityReady: true,
        localizationReady: true,
        analyticsReady: true
      })),
      designSystemBinding: "AVOS Design System",
      brandGovernance: true,
      experienceDnaReady: true,
      score: 100
    };
  }
}
