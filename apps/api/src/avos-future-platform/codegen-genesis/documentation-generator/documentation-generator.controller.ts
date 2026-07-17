import { Controller, Get } from '@nestjs/common';
import { DocumentationGeneratorService } from './documentation-generator.service';

@Controller('avos/future/codegen-genesis/documentation-generator')
export class DocumentationGeneratorController {
  constructor(private readonly service: DocumentationGeneratorService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}