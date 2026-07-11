import { Injectable } from "@nestjs/common";

@Injectable()
export class ForecastEngineService{
 generate(data:any){
   return{
     next30Days:{},
     next90Days:{},
     next365Days:{},
   };
 }
}
