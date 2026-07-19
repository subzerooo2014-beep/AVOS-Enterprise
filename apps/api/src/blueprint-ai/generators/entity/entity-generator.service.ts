import { Injectable } from "@nestjs/common";

@Injectable()
export class EntityGeneratorService{

 generate(name:string){
   return {
      generator:"entity",
      target:name,
      files:[
        name+".ts"
      ],
      generatedAt:new Date().toISOString()
   };
 }

}
