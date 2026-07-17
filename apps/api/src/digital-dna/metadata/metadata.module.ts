import { Module } from "@nestjs/common";
import { DigitalDnaMetadataController } from "./metadata.controller";
import { DigitalDnaMetadataService } from "./metadata.service";

@Module({
  controllers: [DigitalDnaMetadataController],
  providers: [DigitalDnaMetadataService],
  exports: [DigitalDnaMetadataService],
})
export class DigitalDnaMetadataModule {}