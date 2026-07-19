import { Injectable } from "@nestjs/common";

@Injectable()
export class QueryGeneratorService{

 generate(name:string){
   return {
      generator:"query",
      target:name,
      files:[
        name+".ts"
      ],
      generatedAt:new Date().toISOString()
   };
 }

}
