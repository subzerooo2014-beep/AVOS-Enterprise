import { Injectable } from "@nestjs/common";
@Injectable()
export class CampaignPolicy {
  validate(name:string,budget:number,objective:string){
    if(name.trim().length<3) throw new Error("Campaign name too short");
    if(budget<=0) throw new Error("Invalid campaign budget");
    if(!objective) throw new Error("Campaign objective required");
    return true;
  }
}
