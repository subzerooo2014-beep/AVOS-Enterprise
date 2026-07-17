import { Module } from '@nestjs/common';
import { CollaborationMeshController } from './collaboration-mesh.controller';
import { CollaborationMeshService } from './collaboration-mesh.service';

@Module({
  controllers: [CollaborationMeshController],
  providers: [CollaborationMeshService],
  exports: [CollaborationMeshService],
})
export class CollaborationMeshModule {}