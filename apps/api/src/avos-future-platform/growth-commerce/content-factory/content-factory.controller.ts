import { Controller, Get } from '@nestjs/common';
import { ContentFactoryService } from './content-factory.service';

@Controller('avos/future/growth-commerce/content-factory')
export class ContentFactoryController {
  constructor(private readonly service: ContentFactoryService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}