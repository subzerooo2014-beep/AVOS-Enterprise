import { Injectable } from '@nestjs/common';
import { DataAsset } from './enterprise-data-knowledge-fabric.types';

@Injectable()
export class DataSovereigntyIntelligenceService {
  analyze(
    assets: DataAsset[],
    allowedRegionsByClassification: Record<string, string[]>,
  ) {
    const evaluated = assets.map((asset) => {
      const allowedRegions =
        allowedRegionsByClassification[asset.classification] ?? [];
      return {
        ...asset,
        compliant: allowedRegions.includes(asset.region),
        allowedRegions,
      };
    });

    return {
      assets: evaluated,
      compliant: evaluated.every((asset) => asset.compliant),
      violations: evaluated
        .filter((asset) => !asset.compliant)
        .map((asset) => asset.id),
    };
  }
}