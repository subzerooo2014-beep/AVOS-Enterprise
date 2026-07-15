import { Injectable } from '@nestjs/common';
import { ServiceBooking } from './service-provider-marketplace.types';

@Injectable()
export class ServiceBookingEngineService {
  private readonly bookings = new Map<string, ServiceBooking>();

  create(booking: ServiceBooking) {
    this.bookings.set(booking.id, { ...booking });
    return { ...booking };
  }

  transition(id: string, status: ServiceBooking['status']) {
    const current = this.bookings.get(id);
    if (!current) {
      throw new Error(`Booking not found: ${id}`);
    }

    const updated = { ...current, status };
    this.bookings.set(id, updated);
    return { ...updated };
  }

  list() {
    return [...this.bookings.values()].map((booking) => ({ ...booking }));
  }
}