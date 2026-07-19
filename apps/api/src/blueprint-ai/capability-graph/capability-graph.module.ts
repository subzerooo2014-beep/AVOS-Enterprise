import { Module } from "@nestjs/common";
import { CapabilityGraphService } from "./capability-graph.service";
import { CapabilityGraphController } from "./capability-graph.controller";

@Module({
  providers:[CapabilityGraphService],
  controllers:[CapabilityGraphController],
  exports:[CapabilityGraphService]
})
export class CapabilityGraphModule {}
