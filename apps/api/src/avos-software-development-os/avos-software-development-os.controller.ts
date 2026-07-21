import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AvosSoftwareDevelopmentOsService } from './avos-software-development-os.service';
import { SoftwareProjectRequest } from './avos-software-development-os.types';

@Controller('avos/software-development-os')
export class AvosSoftwareDevelopmentOsController {
  constructor(
    private readonly softwareDevelopmentOs: AvosSoftwareDevelopmentOsService,
  ) {}

  @Get('status')
  status() {
    return this.softwareDevelopmentOs.status();
  }

  @Get('runs')
  listRuns() {
    return this.softwareDevelopmentOs.listRuns();
  }

  @Get('runs/:id')
  getRun(@Param('id') id: string) {
    return this.softwareDevelopmentOs.getRun(id);
  }

  @Post('runs')
  createRun(@Body() request: SoftwareProjectRequest) {
    return this.softwareDevelopmentOs.createRun(request);
  }

  @Post('runs/:id/approve')
  approve(
    @Param('id') id: string,
    @Body() body: { approvedBy: string },
  ) {
    return this.softwareDevelopmentOs.approve(id, body.approvedBy);
  }

  @Post('runs/:id/execute')
  execute(@Param('id') id: string) {
    return this.softwareDevelopmentOs.execute(id);
  }

  @Post('runs/:id/verify')
  verify(@Param('id') id: string) {
    return this.softwareDevelopmentOs.verify(id);
  }

  @Post('runs/:id/certify')
  certify(
    @Param('id') id: string,
    @Body() body: { approvedBy: string },
  ) {
    return this.softwareDevelopmentOs.certify(id, body.approvedBy);
  }

  @Get('runs/:id/evolution-assessment')
  evolutionAssessment(@Param('id') id: string) {
    return this.softwareDevelopmentOs.evolutionAssessment(id);
  }
}