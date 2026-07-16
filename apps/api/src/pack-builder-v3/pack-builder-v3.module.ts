import { Module } from "@nestjs/common";
import { PackBuilderV3Controller } from "./pack-builder-v3.controller";
import { PackBuilderV3Service } from "./pack-builder-v3.service";

@Module({
  controllers: [PackBuilderV3Controller],
  providers: [PackBuilderV3Service],
  exports: [PackBuilderV3Service],
})
export class PackBuilderV3Module {}