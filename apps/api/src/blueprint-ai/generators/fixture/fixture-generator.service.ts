import { Injectable } from "@nestjs/common";

@Injectable()
export class FixtureGeneratorService{

 generate(name:string){
   return {
      generator:"fixture",
      target:name,
      files:[
        name+".ts"
      ],
      generatedAt:new Date().toISOString()
   };
 }

}
