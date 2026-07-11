import { Injectable } from "@nestjs/common";

@Injectable()
export class MarketplaceAiService{
 recommend(vehicle:any){
   return{
     featured:true,
     ranking:98,
   };
 }
}
