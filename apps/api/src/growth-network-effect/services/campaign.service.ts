import { Injectable, NotFoundException } from "@nestjs/common";
import { CampaignPolicy } from "../policies/campaign.policy";
import { GrowthCampaignRecord } from "../growth-network-effect.types";
import { growthId } from "../growth-network-effect.utils";
@Injectable()
export class CampaignService {
  private readonly records=new Map<string,GrowthCampaignRecord>();
  constructor(private readonly policy:CampaignPolicy){}
  create(input:any){this.policy.validate(input.name,input.budget,input.objective);const now=new Date().toISOString();const r:GrowthCampaignRecord={id:growthId("campaign"),...input,status:"DRAFT",createdAt:now,updatedAt:now};this.records.set(r.id,r);return r;}
  update(id:string,input:any){const r=this.records.get(id);if(!r)throw new NotFoundException("Campaign not found");Object.assign(r,input,{updatedAt:new Date().toISOString()});return r;}
  list(){return [...this.records.values()];}
}
