import { Injectable } from "@nestjs/common";

@Injectable()
export class ParallelExecutionService {

 async execute(tasks:any[]){

   return Promise.all(
      tasks.map(async t=>({
         task:t,
         status:"DONE"
      }))
   );

 }

}
