import { Injectable } from '@nestjs/common';
import { DataAsset } from './enterprise-data-knowledge-fabric.types';

@Injectable()
export class DataQualityIntelligenceService {
  analyze(assets: DataAsset[]) {
    const evaluated = assets.map((asset) => ({
      ...asset,
      freshnessScore: Math.max(
        0,
        Math.round(100 - Math.min(100, asset.freshnessMinutes / 10)),
      ),
      qualityStatus:
        asset.qualityScore >= 85
          ? 'excellent'
          : asset.qualityScore >= 70
            ? 'good'
            : asset.qualityScore >= 50
              ? 'warning'
              : 'critical',
    }));

    return {
      assets: evaluated,
      qualityScore: Math.round(
        evaluated.reduce(
          (sum, asset) =>
            sum + asset.qualityScore * 0.7 + asset.freshnessScore * 0.3,
          0,
        ) / Math.max(1, evaluated.length),
      ),
      criticalAssets: evaluated
        .filter((asset) => asset.qualityStatus === 'critical')
        .map((asset) => asset.id),
    };
  }
}