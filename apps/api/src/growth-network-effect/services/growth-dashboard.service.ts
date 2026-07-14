import { Injectable } from "@nestjs/common";
import { CampaignService } from "./campaign.service";
import { ReferralService } from "./referral.service";
import { RetentionService } from "./retention.service";
import { GrowthRevenueService } from "./revenue.service";
@Injectable()
export class GrowthDashboardService {
  constructor(private readonly campaigns:CampaignService,private readonly referrals:ReferralService,private readonly retention:RetentionService,private readonly revenue:GrowthRevenueService){}
  summary(){return {campaigns:this.campaigns.list().length,referrals:this.referrals.list().length,retentionRecords:this.retention.list().length,revenueRecords:this.revenue.list().length};}
}
