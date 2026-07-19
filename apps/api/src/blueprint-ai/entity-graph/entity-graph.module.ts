import { Module } from "@nestjs/common";
import { EntityGraphService } from "./entity-graph.service";
import { EntityGraphController } from "./entity-graph.controller";

@Module({
  providers:[EntityGraphService],
  controllers:[EntityGraphController],
  exports:[EntityGraphService]
})
export class EntityGraphModule {}
