import { Injectable } from "@nestjs/common";
@Injectable()
export class MediaAnalysisService {
  analyze(urls: string[]) {
    return {
      mediaCount: urls.length,
      qualityScore: Math.min(100, 65 + urls.length * 3),
      detectedDamages: [],
      recommendedCoverIndex: 0,
      confidence: 88,
    };
  }
}
