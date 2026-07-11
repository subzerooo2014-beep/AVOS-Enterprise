import { Injectable } from "@nestjs/common";

@Injectable()
export class TokenAccountingService{

 calculate(input:string,output:string){

   return{
      promptTokens:Math.ceil(input.length/4),
      completionTokens:Math.ceil(output.length/4),
      totalTokens:
        Math.ceil(input.length/4)+
        Math.ceil(output.length/4),
   };

 }

}
