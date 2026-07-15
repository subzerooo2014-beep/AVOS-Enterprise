import { Injectable } from '@nestjs/common';
import {
  FraudSignal,
  ListingMedia,
  VehicleListing,
} from './vehicle-marketplace-operations.types';

@Injectable()
export class ListingFraudProtectionService {
  evaluate(
    listing: VehicleListing,
    media: ListingMedia[],
    externalSignals: FraudSignal[] = [],
  ) {
    const signals: FraudSignal[] = [...externalSignals];

    if (!listing.vin) {
      signals.push({
        id: `${listing.id}:missing-vin`,
        listingId: listing.id,
        type: 'missing-vin',
        riskScore: 20,
        evidence: [],
      });
    }

    const duplicateChecksums = media
      .filter((item) => item.checksum)
      .filter(
        (item, index, list) =>
          list.findIndex(
            (candidate) =>
              candidate.checksum === item.checksum,
          ) !== index,
      );

    if (duplicateChecksums.length > 0) {
      signals.push({
        id: `${listing.id}:duplicate-media`,
        listingId: listing.id,
        type: 'duplicate-media',
        riskScore: 45,
        evidence: duplicateChecksums.map((item) => item.id),
      });
    }

    const riskScore = Math.min(
      100,
      signals.reduce((sum, signal) => sum + signal.riskScore, 0),
    );

    return {
      listingId: listing.id,
      riskScore,
      blocked: riskScore >= 70,
      signals,
    };
  }
}