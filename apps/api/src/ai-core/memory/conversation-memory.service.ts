import { Injectable } from "@nestjs/common";

@Injectable()
export class ConversationMemoryService {

  private history = new Map<string, any[]>();

  append(sessionId:string,message:any){
    const list=this.history.get(sessionId)??[];
    list.push(message);
    this.history.set(sessionId,list);
    return list;
  }

  get(sessionId:string){
    return this.history.get(sessionId)??[];
  }

  clear(sessionId:string){
    this.history.delete(sessionId);
  }

}
