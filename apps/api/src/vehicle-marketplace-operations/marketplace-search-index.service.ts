import { Injectable } from '@nestjs/common';
import { SearchDocument } from './vehicle-marketplace-operations.types';

@Injectable()
export class MarketplaceSearchIndexService {
  private readonly documents = new Map<string, SearchDocument>();

  index(document: SearchDocument) {
    this.documents.set(document.id, { ...document });
    return { ...document };
  }

  search(input: {
    query?: string;
    make?: string;
    model?: string;
    minYear?: number;
    maxYear?: number;
    minPrice?: number;
    maxPrice?: number;
    region?: string;
  }) {
    const query = input.query?.toLowerCase();

    return [...this.documents.values()].filter((document) => {
      if (document.status !== 'published') return false;
      if (query && !document.text.toLowerCase().includes(query)) return false;
      if (input.make && document.make !== input.make) return false;
      if (input.model && document.model !== input.model) return false;
      if (input.region && document.region !== input.region) return false;
      if (input.minYear && document.year < input.minYear) return false;
      if (input.maxYear && document.year > input.maxYear) return false;
      if (input.minPrice && document.price < input.minPrice) return false;
      if (input.maxPrice && document.price > input.maxPrice) return false;
      return true;
    });
  }
}