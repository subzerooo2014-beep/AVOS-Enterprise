import { Controller, Get } from '@nestjs/common';
import { KnowledgeCertificationService } from './knowledge-certification.service';

@Controller('avos/future/knowledge-memory/knowledge-certification')
export class KnowledgeCertificationController {
  constructor(private readonly service: KnowledgeCertificationService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}