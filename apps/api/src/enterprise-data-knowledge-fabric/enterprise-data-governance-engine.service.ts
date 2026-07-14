import { Injectable } from '@nestjs/common';
import { DataAsset } from './enterprise-data-knowledge-fabric.types';

@Injectable()
export class EnterpriseDataGovernanceEngineService {
  evaluate(assets: DataAsset[]) {
    const governed = assets.map((asset) => {
      const freshnessScore = Math.max(
        0,
        100 - Math.min(100, asset.freshnessMinutes / 10),
      );
      const governanceScore =
        asset.qualityScore * 0.6 +
        freshnessScore * 0.25 +
        (asset.owner ? 15 : 0);

      return {
        ...asset,
        governanceScore: Math.round(
          Math.max(0, Math.min(100, governanceScore)),
        ),
        governed:
          asset.owner.length > 0 &&
          asset.qualityScore >= 70 &&
          freshnessScore >= 60,
      };
    });

    return {
      assets: governed,
      governanceScore: Math.round(
        governed.reduce((sum, asset) => sum + asset.governanceScore, 0) /
          Math.max(1, governed.length),
      ),
      ungovernedAssets: governed
        .filter((asset) => !asset.governed)
        .map((asset) => asset.id),
      domains: [...new Set(governed.map((asset) => asset.domain))],
    };
  }
}