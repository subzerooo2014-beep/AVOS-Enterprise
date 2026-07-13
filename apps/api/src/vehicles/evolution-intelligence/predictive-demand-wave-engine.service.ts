import { Injectable } from "@nestjs/common";

@Injectable()
export class PredictiveDemandWaveEngineService {
  forecast(input: {
    trendScore: number;
    seasonalScore: number;
    searchScore: number;
    conversionScore: number;
  }) {
    const waveScore = Math.round(
      input.trendScore * 0.3 +
        input.seasonalScore * 0.2 +
        input.searchScore * 0.25 +
        input.conversionScore * 0.25,
    );

    return {
      waveScore,
      phase: waveScore >= 80 ? "SURGE" : waveScore >= 55 ? "GROWTH" : "CALM",
    };
  }
}
