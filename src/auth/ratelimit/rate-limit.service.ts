import { Injectable } from "@nestjs/common";

@Injectable()
export class RateLimitService{

 allow(key:string){

   return true;

 }

}
