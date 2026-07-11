import { Injectable } from "@nestjs/common";
import { EmbeddingService } from "../embeddings/embedding.service";
import { VectorStoreService } from "../vectors/vector-store.service";
import { KnowledgeBaseService } from "../knowledge/knowledge-base.service";

@Injectable()
export class RagEngineService {

 constructor(
   private embeddings:EmbeddingService,
   private vectors:VectorStoreService,
   private kb:KnowledgeBaseService,
 ){}

 async index(id:string,text:string){

   const emb=await this.embeddings.embed(text);

   this.kb.add({id,text});

   this.vectors.add(id,emb.vector,{text});

   return{
      indexed:true,
      id
   };

 }

 async retrieve(question:string){

   const emb=await this.embeddings.embed(question);

   return{
      question,
      matches:this.vectors.search(emb.vector),
      knowledge:this.kb.all()
   };

 }

}
