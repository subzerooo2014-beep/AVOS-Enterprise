import { Injectable } from "@nestjs/common";
import { ReservationPolicy } from "../policies/reservation.policy";
@Injectable()
export class JourneyReservationService {
  constructor(private readonly policy: ReservationPolicy) {}
  create(input: { journeyId: string; amount: number; expiresInHours?: number }) {
    this.policy.validate(input.amount);
    return { id: `res_${Date.now()}`, ...input, status: "ACTIVE", createdAt: new Date().toISOString() };
  }
}
