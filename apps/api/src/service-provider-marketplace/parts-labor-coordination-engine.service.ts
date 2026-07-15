import { Injectable } from '@nestjs/common';

@Injectable()
export class PartsLaborCoordinationEngineService {
  coordinate(input: {
    parts: Array<{ id: string; available: boolean; leadTimeDays: number }>;
    technicians: Array<{ id: string; available: boolean; skill: string }>;
  }) {
    const unavailableParts = input.parts.filter((part) => !part.available);
    const availableTechnicians = input.technicians.filter(
      (technician) => technician.available,
    );

    return {
      ready:
        unavailableParts.length === 0 &&
        availableTechnicians.length > 0,
      unavailableParts: unavailableParts.map((part) => part.id),
      technicians: availableTechnicians.map((technician) => technician.id),
      maximumLeadTimeDays: Math.max(
        0,
        ...input.parts.map((part) => part.leadTimeDays),
      ),
    };
  }
}