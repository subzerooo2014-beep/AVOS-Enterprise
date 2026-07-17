import { Controller, Get } from '@nestjs/common';
import { CollaborationMeshService } from './collaboration-mesh.service';

@Controller('avos/future/marketplace-ecosystem/collaboration-mesh')
export class CollaborationMeshController {
  constructor(private readonly service: CollaborationMeshService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}