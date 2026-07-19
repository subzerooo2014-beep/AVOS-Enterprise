import { Injectable } from "@nestjs/common";

@Injectable()
export class HandlerGeneratorService{

 generate(name:string){
   return {
      generator:"handler",
      target:name,
      files:[
        name+".ts"
      ],
      generatedAt:new Date().toISOString()
   };
 }

}
