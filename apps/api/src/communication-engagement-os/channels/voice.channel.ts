import { Injectable } from "@nestjs/common";
@Injectable()
export class VoiceChannel {
  send(target:string,payload:Record<string,unknown>){
    return {id:"voice_"+Date.now(),target,payload,channel:"",status:"SENT"};
  }
}
