import { Module } from "@nestjs/common";
import { ArtifactLoaderService } from "./artifact-loader.service";
import { ArtifactLoaderController } from "./artifact-loader.controller";

@Module({
 providers:[ArtifactLoaderService],
 controllers:[ArtifactLoaderController],
 exports:[ArtifactLoaderService]
})
export class ArtifactLoaderModule{}
