import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobEventService {

  create(type:string,payload:any){
    return{
      type,
      payload,
      createdAt:new Date(),
    };
  }

}
