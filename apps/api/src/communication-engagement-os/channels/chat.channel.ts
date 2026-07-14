import { Injectable } from "@nestjs/common";
@Injectable()
export class ChatChannel {
  send(target:string,payload:Record<string,unknown>){
    return {id:"chat_"+Date.now(),target,payload,channel:"",status:"SENT"};
  }
}
