import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherEngineTaskService {

  create(name:string,payload:any){
    return{
      id:crypto.randomUUID(),
      name,
      payload,
      status:"queued",
      createdAt:new Date(),
    };
  }

}
