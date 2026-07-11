import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobCheckpointService {

  checkpoint(jobId:string,name:string){
    return{
      jobId,
      checkpoint:name,
      createdAt:new Date(),
    };
  }

}
