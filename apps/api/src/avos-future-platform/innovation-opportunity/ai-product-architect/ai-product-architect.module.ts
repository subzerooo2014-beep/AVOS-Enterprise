import { Module } from '@nestjs/common';
import { AiProductArchitectController } from './ai-product-architect.controller';
import { AiProductArchitectService } from './ai-product-architect.service';

@Module({
  controllers: [AiProductArchitectController],
  providers: [AiProductArchitectService],
  exports: [AiProductArchitectService],
})
export class AiProductArchitectModule {}