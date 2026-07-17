import { Controller, Get } from '@nestjs/common';
import { NotificationIntelligenceService } from './notification-intelligence.service';

@Controller('avos/future/growth-commerce/notification-intelligence')
export class NotificationIntelligenceController {
  constructor(private readonly service: NotificationIntelligenceService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}