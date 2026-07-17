import { Controller, Get } from '@nestjs/common';
import { PrismaGeneratorService } from './prisma-generator.service';

@Controller('avos/future/codegen-genesis/prisma-generator')
export class PrismaGeneratorController {
  constructor(private readonly service: PrismaGeneratorService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}