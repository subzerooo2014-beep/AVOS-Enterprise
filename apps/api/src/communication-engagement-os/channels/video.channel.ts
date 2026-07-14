import { Injectable } from "@nestjs/common";
@Injectable()
export class VideoChannel {
  send(target:string,payload:Record<string,unknown>){
    return {id:"video_"+Date.now(),target,payload,channel:"",status:"SENT"};
  }
}
