import { Module } from "@nestjs/common";
import { SuperAppV3Controller } from "./super-app-v3.controller";
import { SuperAppV3DealService } from "./super-app-v3.deal.service";
import { SuperAppV3MatchingService } from "./super-app-v3.matching.service";
import { SuperAppV3TrustFraudService } from "./super-app-v3.trust-fraud.service";

@Module({
  controllers: [SuperAppV3Controller],
  providers: [
    SuperAppV3MatchingService,
    SuperAppV3DealService,
    SuperAppV3TrustFraudService,
  ],
  exports: [
    SuperAppV3MatchingService,
    SuperAppV3DealService,
    SuperAppV3TrustFraudService,
  ],
})
export class SuperAppV3Module {}
