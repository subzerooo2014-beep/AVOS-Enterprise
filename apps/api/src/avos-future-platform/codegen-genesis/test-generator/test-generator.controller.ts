import { Controller, Get } from '@nestjs/common';
import { TestGeneratorService } from './test-generator.service';

@Controller('avos/future/codegen-genesis/test-generator')
export class TestGeneratorController {
  constructor(private readonly service: TestGeneratorService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}