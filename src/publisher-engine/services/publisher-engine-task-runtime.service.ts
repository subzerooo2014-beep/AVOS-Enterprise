import { Injectable } from "@nestjs/common";
import { PublisherEngineTaskReportService } from "./publisher-engine-task-report.service";
import { PublisherEngineTaskRunnerService } from "./publisher-engine-task-runner.service";

@Injectable()
export class PublisherEngineTaskRuntimeService{

  constructor(
    private readonly report:PublisherEngineTaskReportService,
    private readonly runner:PublisherEngineTaskRunnerService,
  ){}

  runtime(){

    return{

      report:this.report.report(),
      runner:this.runner.run(),
      generatedAt:new Date(),

    };

  }

}
