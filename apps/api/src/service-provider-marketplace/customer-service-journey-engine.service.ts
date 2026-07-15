import { Injectable } from '@nestjs/common';
import { ServiceBooking } from './service-provider-marketplace.types';

@Injectable()
export class CustomerServiceJourneyEngineService {
  timeline(booking: ServiceBooking) {
    const stages = [
      'requested',
      'confirmed',
      'in-progress',
      'completed',
    ] as const;
    const currentIndex = stages.indexOf(
      booking.status as (typeof stages)[number],
    );

    return {
      bookingId: booking.id,
      currentStatus: booking.status,
      stages: stages.map((stage, index) => ({
        stage,
        completed: currentIndex >= index,
      })),
    };
  }
}