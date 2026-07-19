import { Injectable } from "@nestjs/common";

@Injectable()
export class OpenapiGeneratorService{

 generate(name:string){
   return {
      generator:"openapi",
      target:name,
      files:[
        name+".ts"
      ],
      generatedAt:new Date().toISOString()
   };
 }

}
