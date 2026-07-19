import { Module } from "@nestjs/common";
import { OpenapiGeneratorService } from "./openapi-generator.service";
import { OpenapiGeneratorController } from "./openapi-generator.controller";

@Module({
  providers:[OpenapiGeneratorService],
  controllers:[OpenapiGeneratorController],
  exports:[OpenapiGeneratorService]
})
export class OpenapiGeneratorModule {}
