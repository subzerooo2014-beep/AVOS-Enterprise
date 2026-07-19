import { Module } from "@nestjs/common";
import { IntermediateRepresentationService } from "./intermediate-representation.service";
import { IntermediateRepresentationController } from "./intermediate-representation.controller";

@Module({
  providers:[IntermediateRepresentationService],
  controllers:[IntermediateRepresentationController],
  exports:[IntermediateRepresentationService]
})
export class IntermediateRepresentationModule {}
