import { Injectable } from "@nestjs/common";

@Injectable()
export class DelegationService{
 delegate(to:string){
   return { delegated:true, to };
 }
}
