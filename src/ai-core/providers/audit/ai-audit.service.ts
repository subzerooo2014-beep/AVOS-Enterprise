import { Injectable } from "@nestjs/common";

@Injectable()
export class AiAuditService{

 log(event:string,data:any){

   return{
      event,
      createdAt:new Date().toISOString(),
      data,
   };

 }

}
