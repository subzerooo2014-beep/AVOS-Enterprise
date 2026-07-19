import { Injectable } from "@nestjs/common";

@Injectable()
export class ApprovalNotificationService{
 notify(user:string){
   return { delivered:true, user };
 }
}
