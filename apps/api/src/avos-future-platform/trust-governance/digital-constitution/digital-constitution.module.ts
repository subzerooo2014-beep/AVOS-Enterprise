import { Module } from '@nestjs/common';
import { DigitalConstitutionController } from './digital-constitution.controller';
import { DigitalConstitutionService } from './digital-constitution.service';

@Module({
  controllers: [DigitalConstitutionController],
  providers: [DigitalConstitutionService],
  exports: [DigitalConstitutionService],
})
export class DigitalConstitutionModule {}