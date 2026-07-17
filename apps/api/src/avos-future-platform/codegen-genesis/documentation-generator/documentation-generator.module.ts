import { Module } from '@nestjs/common';
import { DocumentationGeneratorController } from './documentation-generator.controller';
import { DocumentationGeneratorService } from './documentation-generator.service';

@Module({
  controllers: [DocumentationGeneratorController],
  providers: [DocumentationGeneratorService],
  exports: [DocumentationGeneratorService],
})
export class DocumentationGeneratorModule {}