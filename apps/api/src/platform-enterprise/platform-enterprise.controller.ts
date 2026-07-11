import { Body, Controller, Get, Post } from '@nestjs/common';
import { PlatformEnterpriseService } from './platform-enterprise.service';

@Controller('platform-enterprise')
export class PlatformEnterpriseController {
  constructor(private readonly service: PlatformEnterpriseService) {}

  @Get('health')
  health() {
    return this.service.health();
  }

  @Get('summary')
  summary() {
    return this.service.enterpriseSummary();
  }

  @Get('modules')
  modules() {
    return this.service.moduleRegistry();
  }

  @Get('activity')
  recentActivity() {
    return this.service.recentActivity();
  }

  @Post('activity')
  createActivity(
    @Body('action') action: string,
    @Body('entity') entity?: string,
    @Body('entityId') entityId?: string,
    @Body('userId') userId?: string,
  ) {
    return this.service.createActivity(action, entity, entityId, userId);
  }
}
