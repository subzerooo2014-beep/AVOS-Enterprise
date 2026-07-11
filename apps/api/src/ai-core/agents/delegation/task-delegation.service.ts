import { Injectable } from "@nestjs/common";

@Injectable()
export class TaskDelegationService {

 delegate(agent:string,task:any){

   return{
      delegated:true,
      agent,
      task,
   };

 }

}
