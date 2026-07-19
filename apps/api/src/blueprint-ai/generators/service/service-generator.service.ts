import { Injectable } from "@nestjs/common";

@Injectable()
export class ServiceGeneratorService{

 generate(name:string){
   return {
      generator:"service",
      target:name,
      files:[
        name+".ts"
      ],
      generatedAt:new Date().toISOString()
   };
 }

}
