import { Module } from "@nestjs/common";
import { CapabilityRegistrationService } from "./capability-registration.service";
import { CapabilityRegistrationController } from "./capability-registration.controller";

@Module({
  providers:[CapabilityRegistrationService],
  controllers:[CapabilityRegistrationController],
  exports:[CapabilityRegistrationService]
})
export class CapabilityRegistrationModule {}
