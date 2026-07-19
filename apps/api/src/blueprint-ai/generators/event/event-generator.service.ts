import { Injectable } from "@nestjs/common";

@Injectable()
export class EventGeneratorService{

 generate(name:string){
   return {
      generator:"event",
      target:name,
      files:[
        name+".ts"
      ],
      generatedAt:new Date().toISOString()
   };
 }

}
