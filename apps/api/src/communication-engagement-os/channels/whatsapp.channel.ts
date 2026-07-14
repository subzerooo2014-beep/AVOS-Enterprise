import { Injectable } from "@nestjs/common";
@Injectable()
export class WhatsappChannel {
  send(target:string,payload:Record<string,unknown>){
    return {id:"whatsapp_"+Date.now(),target,payload,channel:"",status:"SENT"};
  }
}
