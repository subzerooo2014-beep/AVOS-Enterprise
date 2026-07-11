import { Injectable } from "@nestjs/common";

@Injectable()
export class DamageDetectionService{
 analyze(image:any){
  return{
   detected:false,
   damages:[],
   status:"VISION_PROVIDER_REQUIRED",
  };
 }
}
