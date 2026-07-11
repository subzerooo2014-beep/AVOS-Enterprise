import { Injectable } from "@nestjs/common";
import { PublisherEngineTaskService } from "./publisher-engine-task.service";
import { PublisherEngineTaskQueueService } from "./publisher-engine-task-queue.service";

@Injectable()
export class PublisherEngineTaskDispatcherService{

  constructor(
    private readonly factory:PublisherEngineTaskService,
    private readonly queue:PublisherEngineTaskQueueService,
  ){}

  dispatch(name:string,payload:any){

    const task=this.factory.create(name,payload);

    this.queue.push(task);

    return task;

  }

}
