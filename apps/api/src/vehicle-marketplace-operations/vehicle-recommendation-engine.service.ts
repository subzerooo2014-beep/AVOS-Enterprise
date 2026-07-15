import { Injectable } from '@nestjs/common';
import { VehicleListing } from './vehicle-marketplace-operations.types';

@Injectable()
export class VehicleRecommendationEngineService {
  recommend(
    listings: VehicleListing[],
    target: VehicleListing,
  ) {
    return listings
      .filter(
        (listing) =>
          listing.id !== target.id &&
          listing.status === 'published',
      )
      .map((listing) => ({
        listing,
        score:
          (listing.make === target.make ? 35 : 0) +
          (listing.model === target.model ? 30 : 0) +
          (Math.abs(listing.year - target.year) <= 2 ? 15 : 0) +
          (Math.abs(listing.price - target.price) <=
          target.price * 0.15
            ? 20
            : 0),
      }))
      .sort((a, b) => b.score - a.score);
  }
}