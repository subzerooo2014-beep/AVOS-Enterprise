import { Module } from "@nestjs/common";
import { DigitalGenomeSecurityController } from "./security.controller";
import { DigitalGenomeSecurityService } from "./security.service";

@Module({
  controllers: [DigitalGenomeSecurityController],
  providers: [DigitalGenomeSecurityService],
  exports: [DigitalGenomeSecurityService],
})
export class DigitalGenomeSecurityModule {}