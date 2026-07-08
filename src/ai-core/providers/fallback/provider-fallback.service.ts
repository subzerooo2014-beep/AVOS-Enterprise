import { Injectable } from "@nestjs/common";

@Injectable()
export class ProviderFallbackService{

 choose(primary:boolean){

   return primary
      ?"openai"
      :"ollama";

 }

}
