import { Injectable } from "@nestjs/common";

@Injectable()
export class ExperienceComposerAiService {
  compose(input: {
    personalization: number;
    simplicity: number;
    relevance: number;
    accessibility: number;
  }) {
    const experienceScore = Math.round(
      input.personalization * 0.3 +
        input.simplicity * 0.25 +
        input.relevance * 0.3 +
        input.accessibility * 0.15,
    );

    return {
      experienceScore,
      mode: experienceScore >= 80 ? "PREMIUM" : experienceScore >= 60 ? "SMART" : "GUIDED",
    };
  }
}
