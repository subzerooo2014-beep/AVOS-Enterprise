import { Injectable } from "@nestjs/common";

@Injectable()
export class DocumentationGeneratorService{

 generate(name:string){
   return {
      generator:"documentation",
      target:name,
      files:[
        name+".ts"
      ],
      generatedAt:new Date().toISOString()
   };
 }

}
