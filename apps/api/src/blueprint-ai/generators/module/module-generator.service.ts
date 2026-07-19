import { Injectable } from "@nestjs/common";

@Injectable()
export class ModuleGeneratorService{

 generate(name:string){
   return {
      generator:"module",
      target:name,
      files:[
        name+".ts"
      ],
      generatedAt:new Date().toISOString()
   };
 }

}
