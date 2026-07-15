import { Injectable } from '@nestjs/common';
import { CapacitySlot } from './service-provider-marketplace.types';

@Injectable()
export class CapacitySchedulingEngineService {
  evaluate(slots: CapacitySlot[]) {
    return slots.map((slot) => ({
      ...slot,
      remaining: Math.max(0, slot.capacity - slot.booked),
      available: slot.booked < slot.capacity,
      utilization:
        slot.capacity === 0
          ? 0
          : Number(((slot.booked / slot.capacity) * 100).toFixed(2)),
    }));
  }
}