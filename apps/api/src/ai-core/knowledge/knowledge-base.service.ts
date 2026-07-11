import { Injectable } from "@nestjs/common";

@Injectable()
export class KnowledgeBaseService {

  private docs:any[]=[];

  add(document:any){
    this.docs.push(document);
    return document;
  }

  all(){
    return this.docs;
  }

}
