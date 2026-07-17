import { Module } from "@nestjs/common";
import { DigitalDnaRegistryController } from "./registry.controller";
import { DigitalDnaRegistryService } from "./registry.service";

@Module({
  controllers: [DigitalDnaRegistryController],
  providers: [DigitalDnaRegistryService],
  exports: [DigitalDnaRegistryService],
})
export class DigitalDnaRegistryModule {}