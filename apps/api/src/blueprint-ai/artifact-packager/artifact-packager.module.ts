import { Module } from "@nestjs/common";
import { ArtifactPackagerService } from "./artifact-packager.service";
import { ArtifactPackagerController } from "./artifact-packager.controller";

@Module({
  providers:[ArtifactPackagerService],
  controllers:[ArtifactPackagerController],
  exports:[ArtifactPackagerService]
})
export class ArtifactPackagerModule {}
