import { Injectable } from "@nestjs/common";
@Injectable()
export class EmailChannel {
  send(target:string,payload:Record<string,unknown>){
    return {id:"email_"+Date.now(),target,payload,channel:"",status:"SENT"};
  }
}
