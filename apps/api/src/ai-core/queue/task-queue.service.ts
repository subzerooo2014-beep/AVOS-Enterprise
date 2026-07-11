import { Injectable } from "@nestjs/common";

@Injectable()
export class TaskQueueService{

  private queue:any[]=[];

  push(task:any){
    this.queue.push(task);
    return this.queue.length;
  }

  pop(){
    return this.queue.shift();
  }

  size(){
    return this.queue.length;
  }

}
