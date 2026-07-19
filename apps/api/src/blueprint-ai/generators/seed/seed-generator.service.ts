import { Injectable } from "@nestjs/common";

@Injectable()
export class SeedGeneratorService{

 generate(name:string){
   return {
      generator:"seed",
      target:name,
      files:[
        name+".ts"
      ],
      generatedAt:new Date().toISOString()
   };
 }

}
