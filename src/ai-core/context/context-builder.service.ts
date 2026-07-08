import { Injectable } from "@nestjs/common";

@Injectable()
export class ContextBuilderService{

 build(input:any,history:any[]){
   return{
      input,
      history,
      timestamp:new Date().toISOString()
   };
 }

}
