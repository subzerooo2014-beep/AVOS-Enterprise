import { Controller, Get } from '@nestjs/common';
import { EnterpriseMetadataLayerService } from './enterprise-metadata-layer.service';

@Controller('avos/future/knowledge-memory/enterprise-metadata-layer')
export class EnterpriseMetadataLayerController {
  constructor(private readonly service: EnterpriseMetadataLayerService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}