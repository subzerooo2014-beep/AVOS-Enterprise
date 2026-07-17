import { Controller, Get } from '@nestjs/common';
import { DeveloperCloudService } from './developer-cloud.service';

@Controller('avos/future/global-platform/developer-cloud')
export class DeveloperCloudController {
  constructor(private readonly service: DeveloperCloudService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}