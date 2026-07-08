import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleMarketService{
 trends(){
  return{
   trend:"STABLE",
   demand:"MEDIUM",
   supply:"MEDIUM",
  };
 }
}
