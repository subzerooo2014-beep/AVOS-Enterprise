import { Injectable } from "@nestjs/common";

@Injectable()
export class DealerEngineService{
  score(dealer:any){
    return{
      dealer,
      score:95,
      verified:true,
    };
  }
}
