import { Module } from "@nestjs/common";
import { DigitalDnaRelationshipsController } from "./relationships.controller";
import { DigitalDnaRelationshipsService } from "./relationships.service";

@Module({
  controllers: [DigitalDnaRelationshipsController],
  providers: [DigitalDnaRelationshipsService],
  exports: [DigitalDnaRelationshipsService],
})
export class DigitalDnaRelationshipsModule {}