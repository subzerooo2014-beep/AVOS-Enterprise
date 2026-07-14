import { Injectable } from "@nestjs/common";
@Injectable()
export class SocialChannel {
  send(target:string,payload:Record<string,unknown>){
    return {id:"social_"+Date.now(),target,payload,channel:"",status:"SENT"};
  }
}
