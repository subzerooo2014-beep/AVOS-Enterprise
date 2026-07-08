import { Injectable } from "@nestjs/common";

@Injectable()
export class SchedulerService{

  schedule(task:any,runAt:Date){

    return{
      id:crypto.randomUUID(),
      runAt,
      task,
      status:"SCHEDULED"
    };

  }

}
