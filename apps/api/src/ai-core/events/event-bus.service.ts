import { Injectable } from "@nestjs/common";

@Injectable()
export class EventBusService{

 publish(event:string,payload:any){

   return{
      event,
      payload,
      publishedAt:new Date().toISOString()
   };

 }

}
