import { Injectable } from "@nestjs/common";

@Injectable()
export class VinDecoderService{
 decode(vin:string){
  return{
   vin,
   manufacturer:"UNKNOWN",
   country:"UNKNOWN",
   year:null,
   engine:null,
   transmission:null,
   readyForDecoderProvider:true,
  };
 }
}
