import { Injectable } from '@nestjs/common';
import {
  CapacitySlot,
  ProviderMetric,
  ServiceBooking,
} from './service-provider-marketplace.types';
import { CapacitySchedulingEngineService } from './capacity-scheduling-engine.service';
import { ProviderPerformanceEngineService } from './provider-performance-engine.service';
import { ServiceQualitySlaEngineService } from './service-quality-sla-engine.service';
import { CustomerServiceJourneyEngineService } from './customer-service-journey-engine.service';

@Injectable()
export class ServiceFulfillmentOrchestratorService {
  constructor(
    private readonly capacity: CapacitySchedulingEngineService,
    private readonly performance: ProviderPerformanceEngineService,
    private readonly sla: ServiceQualitySlaEngineService,
    private readonly journey: CustomerServiceJourneyEngineService,
  ) {}

  run(input: {
    booking: ServiceBooking;
    slots: CapacitySlot[];
    metrics: ProviderMetric[];
    promisedMinutes: number;
    actualMinutes: number;
    qualityScore: number;
  }) {
    const capacity = this.capacity.evaluate(input.slots);
    const performance = this.performance.analyze(input.metrics);
    const sla = this.sla.evaluate({
      promisedMinutes: input.promisedMinutes,
      actualMinutes: input.actualMinutes,
      qualityScore: input.qualityScore,
    });
    const journey = this.journey.timeline(input.booking);

    return {
      capacity,
      performance,
      sla,
      journey,
      ready:
        capacity.some((slot) => slot.available) &&
        !sla.breached,
    };
  }
}