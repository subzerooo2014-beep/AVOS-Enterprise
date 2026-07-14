import { Injectable } from "@nestjs/common";
@Injectable()
export class PushChannel {
  send(target:string,payload:Record<string,unknown>){
    return {id:"push_"+Date.now(),target,payload,channel:"",status:"SENT"};
  }
}
