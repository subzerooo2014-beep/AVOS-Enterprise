import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherDispatchAuditService {

  audit(jobId:string,status:string){
    return{
      jobId,
      status,
      auditedAt:new Date(),
    };
  }

}
