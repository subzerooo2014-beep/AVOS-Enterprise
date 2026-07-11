import { Injectable } from "@nestjs/common";
import { PublisherEngineTaskQueueService } from "./publisher-engine-task-queue.service";

@Injectable()
export class PublisherEngineTaskMonitorService{

  constructor(
    private readonly queue:PublisherEngineTaskQueueService,
  ){}

  monitor(){

    return{

      queued:this.queue.size(),
      tasks:this.queue.all(),
      generatedAt:new Date(),

    };

  }

}
