import { Controller, Get } from '@nestjs/common';
import { ProjectPlatformService } from './project-platform.service';

@Controller('avos/future/enterprise-products/project-platform')
export class ProjectPlatformController {
  constructor(private readonly service: ProjectPlatformService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}