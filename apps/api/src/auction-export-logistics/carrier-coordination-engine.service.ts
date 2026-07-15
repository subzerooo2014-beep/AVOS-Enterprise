import { Injectable } from '@nestjs/common';

@Injectable()
export class CarrierCoordinationEngineService {
  coordinate(input: {
    carrierId: string;
    quoteAccepted: boolean;
    capacityAvailable: boolean;
    documentsReady: boolean;
  }) {
    const ready =
      input.quoteAccepted &&
      input.capacityAvailable &&
      input.documentsReady;

    return {
      ...input,
      ready,
      blockers: [
        ...(!input.quoteAccepted ? ['quote-not-accepted'] : []),
        ...(!input.capacityAvailable ? ['capacity-unavailable'] : []),
        ...(!input.documentsReady ? ['documents-incomplete'] : []),
      ],
    };
  }
}