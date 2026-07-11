import { Module } from "@nestjs/common";
import { InspectionsaiController } from "./inspectionsai.controller";
import { InspectionsaiService } from "./inspectionsai.service";

@Module({
  controllers:[InspectionsaiController],
  providers:[InspectionsaiService],
})
export class InspectionsaiModule {}
