import { Injectable } from "@nestjs/common";

@Injectable()
export class DtoGeneratorService{

 generate(name:string){
   return {
      generator:"dto",
      target:name,
      files:[
        name+".ts"
      ],
      generatedAt:new Date().toISOString()
   };
 }

}
