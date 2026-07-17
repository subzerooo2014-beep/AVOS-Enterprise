import { Controller, Get } from '@nestjs/common';
import { CodegenOsService } from './codegen-os.service';

@Controller('avos/future/codegen-genesis/codegen-os')
export class CodegenOsController {
  constructor(private readonly service: CodegenOsService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}