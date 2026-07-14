import { Injectable } from '@nestjs/common';
import {
  DataAsset,
  MetadataEntry,
} from './enterprise-data-knowledge-fabric.types';

@Injectable()
export class MetadataCatalogIntelligenceService {
  catalog(assets: DataAsset[], metadata: MetadataEntry[]) {
    const catalog = assets.map((asset) => {
      const entries = metadata.filter((entry) => entry.assetId === asset.id);

      return {
        assetId: asset.id,
        name: asset.name,
        metadata: entries,
        metadataCount: entries.length,
        covered: entries.length >= 3,
      };
    });

    return {
      catalog,
      metadataCoverage: Math.round(
        (catalog.filter((item) => item.covered).length /
          Math.max(1, catalog.length)) *
          100,
      ),
      missingMetadataAssets: catalog
        .filter((item) => !item.covered)
        .map((item) => item.assetId),
    };
  }
}