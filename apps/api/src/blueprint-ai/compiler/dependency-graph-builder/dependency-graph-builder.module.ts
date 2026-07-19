import { Module } from "@nestjs/common";
import { DependencyGraphBuilderService } from "./dependency-graph-builder.service";
import { DependencyGraphBuilderController } from "./dependency-graph-builder.controller";

@Module({
  providers:[DependencyGraphBuilderService],
  controllers:[DependencyGraphBuilderController],
  exports:[DependencyGraphBuilderService]
})
export class DependencyGraphBuilderModule {}
