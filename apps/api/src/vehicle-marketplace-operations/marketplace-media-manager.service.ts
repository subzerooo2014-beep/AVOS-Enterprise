import { Injectable } from '@nestjs/common';
import { ListingMedia } from './vehicle-marketplace-operations.types';

@Injectable()
export class MarketplaceMediaManagerService {
  organize(media: ListingMedia[]) {
    const grouped = new Map<string, ListingMedia[]>();

    for (const item of media) {
      const existing = grouped.get(item.listingId) ?? [];
      existing.push(item);
      grouped.set(item.listingId, existing);
    }

    return [...grouped.entries()].map(([listingId, items]) => {
      const sorted = [...items].sort((a, b) => a.order - b.order);
      const cover = sorted.find((item) => item.isCover) ?? sorted[0] ?? null;

      return {
        listingId,
        media: sorted,
        cover,
        duplicates: sorted
          .filter(
            (item, index, list) =>
              item.checksum &&
              list.findIndex(
                (candidate) =>
                  candidate.checksum === item.checksum,
              ) !== index,
          )
          .map((item) => item.id),
      };
    });
  }
}