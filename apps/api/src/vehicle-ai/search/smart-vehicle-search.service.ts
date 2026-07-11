import { Injectable } from "@nestjs/common";

@Injectable()
export class SmartVehicleSearchService{
 search(query:any){
  return{
   status:"READY",
   query,
   matches:[]
  };
 }
}
