import { Module } from "@nestjs/common";
import { DigitalDnaRegistrationService } from "./digital-dna-registration.service";
import { DigitalDnaRegistrationController } from "./digital-dna-registration.controller";

@Module({
  providers:[DigitalDnaRegistrationService],
  controllers:[DigitalDnaRegistrationController],
  exports:[DigitalDnaRegistrationService]
})
export class DigitalDnaRegistrationModule {}
