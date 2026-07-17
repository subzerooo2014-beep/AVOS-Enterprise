import { Module } from '@nestjs/common';
import { KnowledgeCertificationController } from './knowledge-certification.controller';
import { KnowledgeCertificationService } from './knowledge-certification.service';

@Module({
  controllers: [KnowledgeCertificationController],
  providers: [KnowledgeCertificationService],
  exports: [KnowledgeCertificationService],
})
export class KnowledgeCertificationModule {}