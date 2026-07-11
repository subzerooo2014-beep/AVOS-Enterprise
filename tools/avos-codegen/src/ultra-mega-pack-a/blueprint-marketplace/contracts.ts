import {
  UltraValue,
} from "../contracts";

export enum MarketplaceBlueprintStatus {
  DRAFT = "draft",
  REVIEW = "review",
  PUBLISHED = "published",
  SUSPENDED = "suspended",
  DEPRECATED = "deprecated",
}

export interface MarketplaceBlueprint {
  id: string;
  key: string;
  name: string;
  version: string;
  description: string;
  publisher: string;
  status: MarketplaceBlueprintStatus;
  capabilities: string[];
  dependencies: string[];
  compatibility: string[];
  rating: number;
  installCount: number;
  metadata: Record<string, UltraValue>;
  createdAt: string;
  updatedAt: string;
}

export interface MarketplaceReview {
  id: string;
  blueprintId: string;
  reviewer: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
}

export interface MarketplaceInstallation {
  id: string;
  blueprintId: string;
  targetSystem: string;
  version: string;
  installedAt: string;
}

export interface MarketplaceSearchQuery {
  text?: string;
  capability?: string;
  publisher?: string;
  minimumRating?: number;
}

export interface MarketplaceSearchResult {
  items: MarketplaceBlueprint[];
  total: number;
  generatedAt: string;
}
