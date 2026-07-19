import { Injectable } from "@nestjs/common";

@Injectable()
export class ControllerGeneratorService{

 generate(name:string){
   return {
      generator:"controller",
      target:name,
      files:[
        name+".ts"
      ],
      generatedAt:new Date().toISOString()
   };
 }

}
