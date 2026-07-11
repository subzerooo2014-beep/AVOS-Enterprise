import { Body, Controller, Post } from "@nestjs/common";
import { RagEngineService } from "./rag-engine.service";

@Controller("ai-rag")
export class RagEngineController {

 constructor(private rag:RagEngineService){}

 @Post("index")
 index(@Body() dto:any){
   return this.rag.index(dto.id,dto.text);
 }

 @Post("search")
 search(@Body() dto:any){
   return this.rag.retrieve(dto.question);
 }

}
