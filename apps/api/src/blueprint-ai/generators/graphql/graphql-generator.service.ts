import { Injectable } from "@nestjs/common";

@Injectable()
export class GraphqlGeneratorService{

 generate(name:string){
   return {
      generator:"graphql",
      target:name,
      files:[
        name+".ts"
      ],
      generatedAt:new Date().toISOString()
   };
 }

}
