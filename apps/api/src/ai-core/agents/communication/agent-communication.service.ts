import { Injectable } from "@nestjs/common";

@Injectable()
export class AgentCommunicationService {

  send(from:string,to:string,message:any){

    return{
      id:crypto.randomUUID(),
      from,
      to,
      message,
      sentAt:new Date().toISOString(),
    };

  }

}
