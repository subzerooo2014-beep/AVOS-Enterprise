import { Injectable } from "@nestjs/common";

@Injectable()
export class KnowledgeIndexService{
 index(){ return {indexed:true}; }
}
