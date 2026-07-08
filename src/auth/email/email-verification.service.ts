import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailVerificationService{

 send(email:string){

   return{
      sent:true,
      email,
   };

 }

 verify(token:string){

   return{
      verified:true,
      token,
   };

 }

}
