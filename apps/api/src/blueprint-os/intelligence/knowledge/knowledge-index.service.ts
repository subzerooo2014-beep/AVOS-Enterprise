import { Injectable } from "@nestjs/common";

@Injectable()
export class KnowledgeIndexService{
  index(){
    return {
      success:true,
      service:"KnowledgeIndexService",
      timestamp:new Date().toISOString()
    };
  }
}
