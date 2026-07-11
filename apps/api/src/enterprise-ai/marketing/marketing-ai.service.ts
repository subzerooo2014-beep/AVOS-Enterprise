import { Injectable } from "@nestjs/common";

@Injectable()
export class MarketingAiService{
 campaign(input:any){
   return{
     audience:"Recommended",
     budgetSuggestion:0,
     channels:["Google","Meta","TikTok"],
   };
 }
}
