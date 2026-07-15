import { Injectable } from '@nestjs/common';

interface NegotiationOffer {
  id: string;
  listingId: string;
  buyerId: string;
  amount: number;
  currency: string;
  status: 'submitted' | 'accepted' | 'rejected' | 'expired';
}

@Injectable()
export class ReservationNegotiationEngineService {
  evaluate(
    listingPrice: number,
    offers: NegotiationOffer[],
  ) {
    const ranked = [...offers]
      .filter((offer) => offer.status === 'submitted')
      .map((offer) => ({
        ...offer,
        priceRatio:
          listingPrice === 0 ? 0 : offer.amount / listingPrice,
      }))
      .sort((a, b) => b.amount - a.amount);

    return {
      offers: ranked,
      recommendedOffer:
        ranked.find((offer) => offer.priceRatio >= 0.9) ?? null,
    };
  }
}