export interface SearchItem {
  id: string;
  industryKey: string;
  entityType: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  attributes: Record<string, unknown>;
  trustScore: number;
  active: boolean;
}

export interface SearchRequest {
  query: string;
  industryKey?: string;
  entityType?: string;
  minPrice?: number;
  maxPrice?: number;
  attributes?: Record<string, unknown>;
}

export interface SearchResult {
  item: SearchItem;
  score: number;
  reasons: string[];
}

export interface RecommendationRequest {
  customerId: string;
  industryKey: string;
  preferences: Record<string, unknown>;
  viewedItemIds?: string[];
}