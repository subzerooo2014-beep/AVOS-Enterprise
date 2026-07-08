import { Injectable } from "@nestjs/common";

@Injectable()
export class AccountLockoutService{

 private attempts=new Map<string,number>();

 failed(email:string){

   const n=(this.attempts.get(email)??0)+1;

   this.attempts.set(email,n);

   return n;

 }

 reset(email:string){

   this.attempts.delete(email);

 }

}
