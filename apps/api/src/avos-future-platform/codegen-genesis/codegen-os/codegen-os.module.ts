import { Module } from '@nestjs/common';
import { CodegenOsController } from './codegen-os.controller';
import { CodegenOsService } from './codegen-os.service';

@Module({
  controllers: [CodegenOsController],
  providers: [CodegenOsService],
  exports: [CodegenOsService],
})
export class CodegenOsModule {}