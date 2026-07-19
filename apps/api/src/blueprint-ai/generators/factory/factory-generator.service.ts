import { Injectable } from "@nestjs/common";

@Injectable()
export class FactoryGeneratorService{

 generate(name:string){
   return {
      generator:"factory",
      target:name,
      files:[
        name+".ts"
      ],
      generatedAt:new Date().toISOString()
   };
 }

}
