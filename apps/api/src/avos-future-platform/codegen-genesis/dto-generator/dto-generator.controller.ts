import { Controller, Get } from '@nestjs/common';
import { DtoGeneratorService } from './dto-generator.service';

@Controller('avos/future/codegen-genesis/dto-generator')
export class DtoGeneratorController {
  constructor(private readonly service: DtoGeneratorService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}