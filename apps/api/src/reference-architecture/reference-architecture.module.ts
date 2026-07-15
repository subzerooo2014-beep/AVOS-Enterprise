import { Module } from "@nestjs/common";
import { ReferenceArchitectureController } from "./reference-architecture.controller";
import { ReferenceArchitectureService } from "./reference-architecture.service";

@Module({
  controllers: [ReferenceArchitectureController],
  providers: [ReferenceArchitectureService],
  exports: [ReferenceArchitectureService],
})
export class ReferenceArchitectureModule {}