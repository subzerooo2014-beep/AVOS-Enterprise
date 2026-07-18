import { Module } from "@nestjs/common";
import { NestJsGeneratorController } from "./nestjs-generator.controller";
import { NestJsGeneratorService } from "./nestjs-generator.service";

@Module({
  controllers: [NestJsGeneratorController],
  providers: [NestJsGeneratorService],
  exports: [NestJsGeneratorService]
})
export class AvosFactoryMegaPack7Module {}
