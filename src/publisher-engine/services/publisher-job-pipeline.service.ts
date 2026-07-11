import { Injectable } from "@nestjs/common";
import { PublisherJobCheckpointService } from "./publisher-job-checkpoint.service";

@Injectable()
export class PublisherJobPipelineService {

  constructor(
    private readonly checkpoint:PublisherJobCheckpointService,
  ){}

  start(job:any){
    return this.checkpoint.checkpoint(job.id,"pipeline_started");
  }

  finish(job:any){
    return this.checkpoint.checkpoint(job.id,"pipeline_finished");
  }

}
