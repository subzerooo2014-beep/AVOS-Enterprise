import { Injectable } from "@nestjs/common";

@Injectable()
export class MfaService{

 generate(){

   return{
      code:"123456",
   };

 }

 verify(code:string){

   return code==="123456";

 }

}
