import { Injectable } from "@nestjs/common";

@Injectable()
export class FraudDetectionService{
 analyze(vehicle:any){
  return{
   risk:"LOW",
   score:5,
   flags:[],
  };
 }
}
