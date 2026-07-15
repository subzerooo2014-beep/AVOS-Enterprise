import { Injectable } from '@nestjs/common';
import { DepositReservation } from './vehicle-finance-commerce.types';

@Injectable()
export class VehicleDepositReservationEngineService {
  evaluate(reservations: DepositReservation[]) {
    const now = Date.now();

    return reservations.map((reservation) => {
      const expired =
        new Date(reservation.expiresAt).getTime() < now &&
        reservation.status === 'pending';

      return {
        ...reservation,
        status: expired ? 'expired' : reservation.status,
        active:
          !expired &&
          ['pending', 'paid'].includes(reservation.status),
      };
    });
  }
}