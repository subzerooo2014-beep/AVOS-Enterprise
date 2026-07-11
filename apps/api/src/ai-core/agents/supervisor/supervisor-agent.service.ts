import { Injectable } from "@nestjs/common";

@Injectable()
export class SupervisorAgentService{

 review(result:any){

   return{
      approved:true,
      confidence:98,
      result,
   };

 }

}
