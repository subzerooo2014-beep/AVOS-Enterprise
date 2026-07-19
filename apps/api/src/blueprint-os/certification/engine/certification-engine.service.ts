import { Injectable } from "@nestjs/common";

@Injectable()
export class CertificationEngineService{
 certify(){
   return {
     certified:true,
     score:100,
     generatedAt:new Date().toISOString()
   };
 }
}
