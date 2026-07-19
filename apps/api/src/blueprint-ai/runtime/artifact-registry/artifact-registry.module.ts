import { Module } from "@nestjs/common";
import { ArtifactRegistryService } from "./artifact-registry.service";
import { ArtifactRegistryController } from "./artifact-registry.controller";

@Module({
 providers:[ArtifactRegistryService],
 controllers:[ArtifactRegistryController],
 exports:[ArtifactRegistryService]
})
export class ArtifactRegistryModule{}
