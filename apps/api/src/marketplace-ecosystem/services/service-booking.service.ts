import { Injectable } from "@nestjs/common";
import { BookingPolicy } from "../policies/booking.policy";
@Injectable()
export class ServiceBookingService {
  private readonly records: Array<Record<string, unknown>> = [];
  constructor(private readonly policy: BookingPolicy) {}
  create(input: { providerId: string; userId: string; serviceType: string; scheduledAt: string; amount: number }) {
    this.policy.validate(input.scheduledAt, input.amount);
    const record = {
      id: `booking_${Date.now()}`,
      ...input,
      status: "BOOKED",
    };
    this.records.push(record);
    return record;
  }
  list() { return [...this.records]; }
}
