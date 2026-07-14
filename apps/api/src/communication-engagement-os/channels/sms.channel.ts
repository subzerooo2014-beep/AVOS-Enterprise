import { Injectable } from "@nestjs/common";
@Injectable()
export class SmsChannel {
  send(target:string,payload:Record<string,unknown>){
    return {id:"sms_"+Date.now(),target,payload,channel:"",status:"SENT"};
  }
}
