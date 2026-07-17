import { Module } from '@nestjs/common';
import { InnovationPortfolioGovernorController } from './innovation-portfolio-governor.controller';
import { InnovationPortfolioGovernorService } from './innovation-portfolio-governor.service';

@Module({
  controllers: [InnovationPortfolioGovernorController],
  providers: [InnovationPortfolioGovernorService],
  exports: [InnovationPortfolioGovernorService],
})
export class InnovationPortfolioGovernorModule {}