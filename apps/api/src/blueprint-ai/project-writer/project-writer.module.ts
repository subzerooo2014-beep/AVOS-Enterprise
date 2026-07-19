import { Module } from "@nestjs/common";
import { ProjectWriterService } from "./project-writer.service";
import { ProjectWriterController } from "./project-writer.controller";

@Module({
  providers:[ProjectWriterService],
  controllers:[ProjectWriterController],
  exports:[ProjectWriterService]
})
export class ProjectWriterModule {}
