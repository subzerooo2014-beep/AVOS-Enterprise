import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherEngineTaskQueueService{

  private readonly queue:any[]=[];

  push(task:any){
    this.queue.push(task);
    return task;
  }

  shift(){
    return this.queue.shift();
  }

  size(){
    return this.queue.length;
  }

  all(){
    return this.queue;
  }

}
