import { Injectable } from "@nestjs/common";
import { PublisherEngineTaskQueueService } from "./publisher-engine-task-queue.service";

@Injectable()
export class PublisherEngineTaskRunnerService{

  constructor(
    private readonly queue:PublisherEngineTaskQueueService,
  ){}

  run(){

    const task=this.queue.shift();

    if(!task){
      return null;
    }

    task.status="completed";
    task.completedAt=new Date();

    return task;

  }

}
