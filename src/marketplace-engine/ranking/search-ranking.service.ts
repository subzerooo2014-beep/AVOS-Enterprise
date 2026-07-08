import { Injectable } from "@nestjs/common";

@Injectable()
export class SearchRankingService{
  rank(items:any[]){
    return items.map((x,index)=>({
      ...x,
      rankingScore:100-index,
    }));
  }
}
