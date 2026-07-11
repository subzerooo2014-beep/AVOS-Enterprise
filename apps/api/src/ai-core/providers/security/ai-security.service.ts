import { Injectable } from "@nestjs/common";

@Injectable()
export class AiSecurityService{

 validate(prompt:string){

   return{
      safe:true,
      promptLength:prompt.length,
   };

 }

}
