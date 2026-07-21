import { Module } from '@nestjs/common';
import { DealerService } from './dealer.service';
import { ListingService } from './listing.service';
import { MobilityAiService } from './mobility-ai.service';
import { MobilityAuditService } from './mobility-audit.service';
import { MobilityCapabilityRegistryService } from './mobility-capability-registry.service';
import { MobilityController } from './mobility.controller';
import { MobilityGlobalizationService } from './mobility-globalization.service';
import { MobilityLaunchService } from './mobility-launch.service';
import { MobilityPersistenceService } from './mobility-persistence.service';
import { MobilityReadinessService } from './mobility-readiness.service';
import { VehicleService } from './vehicle.service';

@Module({
  controllers: [MobilityController],
  providers: [
    MobilityPersistenceService,
    MobilityAuditService,
    VehicleService,
    DealerService,
    ListingService,
    MobilityAiService,
    MobilityCapabilityRegistryService,
    MobilityGlobalizationService,
    MobilityReadinessService,
    MobilityLaunchService,
  ],
  exports: [
    VehicleService,
    DealerService,
    ListingService,
    MobilityAiService,
    MobilityCapabilityRegistryService,
    MobilityReadinessService,
  ],
})
export class MobilityUltimateMegaPack1Module {}