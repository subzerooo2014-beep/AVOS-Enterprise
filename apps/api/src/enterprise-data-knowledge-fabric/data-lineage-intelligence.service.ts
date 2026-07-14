import { Injectable } from '@nestjs/common';
import {
  DataAsset,
  DataLineageEdge,
} from './enterprise-data-knowledge-fabric.types';

@Injectable()
export class DataLineageIntelligenceService {
  analyze(assets: DataAsset[], edges: DataLineageEdge[]) {
    const assetIds = new Set(assets.map((asset) => asset.id));
    const validEdges = edges.filter(
      (edge) =>
        assetIds.has(edge.fromAssetId) &&
        assetIds.has(edge.toAssetId),
    );

    const connectedAssets = new Set(
      validEdges.flatMap((edge) => [
        edge.fromAssetId,
        edge.toAssetId,
      ]),
    );

    return {
      edges: validEdges,
      invalidEdges: edges
        .filter((edge) => !validEdges.includes(edge))
        .map((edge) => edge.id),
      lineageCoverage: Math.round(
        (connectedAssets.size / Math.max(1, assets.length)) * 100,
      ),
      orphanAssets: assets
        .filter((asset) => !connectedAssets.has(asset.id))
        .map((asset) => asset.id),
    };
  }
}