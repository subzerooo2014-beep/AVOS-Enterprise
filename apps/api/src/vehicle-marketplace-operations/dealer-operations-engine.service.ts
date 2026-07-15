import { Injectable } from '@nestjs/common';
import {
  InventoryRecord,
  VehicleListing,
} from './vehicle-marketplace-operations.types';

@Injectable()
export class DealerOperationsEngineService {
  summarize(
    dealerId: string,
    listings: VehicleListing[],
    inventory: InventoryRecord[],
  ) {
    const dealerListings = listings.filter(
      (listing) => listing.dealerId === dealerId,
    );
    const listingIds = new Set(
      dealerListings.map((listing) => listing.id),
    );
    const dealerInventory = inventory.filter((record) =>
      listingIds.has(record.listingId),
    );

    return {
      dealerId,
      listings: dealerListings.length,
      published: dealerListings.filter(
        (listing) => listing.status === 'published',
      ).length,
      reserved: dealerListings.filter(
        (listing) => listing.status === 'reserved',
      ).length,
      sold: dealerListings.filter(
        (listing) => listing.status === 'sold',
      ).length,
      branches: [
        ...new Set(
          dealerInventory
            .map((record) => record.branchId)
            .filter(Boolean),
        ),
      ],
    };
  }
}