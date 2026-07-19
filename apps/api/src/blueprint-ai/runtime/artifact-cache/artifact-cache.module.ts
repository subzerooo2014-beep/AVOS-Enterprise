import { Module } from "@nestjs/common";
import { ArtifactCacheService } from "./artifact-cache.service";
import { ArtifactCacheController } from "./artifact-cache.controller";

@Module({
 providers:[ArtifactCacheService],
 controllers:[ArtifactCacheController],
 exports:[ArtifactCacheService]
})
export class ArtifactCacheModule{}
