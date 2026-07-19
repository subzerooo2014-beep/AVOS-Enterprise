import { Injectable } from "@nestjs/common";

@Injectable()
export class MapperGeneratorService{

 generate(name:string){
   return {
      generator:"mapper",
      target:name,
      files:[
        name+".ts"
      ],
      generatedAt:new Date().toISOString()
   };
 }

}
