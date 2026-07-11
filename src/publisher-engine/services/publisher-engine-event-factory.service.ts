import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherEngineEventFactoryService{

  create(type:string,payload:any){
    return{
      id:crypto.randomUUID(),
      type,
      payload,
      createdAt:new Date(),
    };
  }

}
