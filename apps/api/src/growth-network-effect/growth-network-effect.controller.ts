import { Body, Controller, Get, Post } from "@nestjs/common";
import { GrowthNetworkEffectService } from "./growth-network-effect.service";
import { GrowthBrainEngine } from "./ai/growth-brain.engine";
import { RetentionAiEngine } from "./ai/retention-ai.engine";
import { RevenueOptimizerEngine } from "./ai/revenue-optimizer.engine";
import { ViralEngine } from "./ai/viral-engine";
import { SeoIntelligenceEngine } from "./ai/seo-intelligence.engine";
import { CompetitorIntelligenceEngine } from "./ai/competitor-intelligence.engine";
import { ContentIntelligenceEngine } from "./ai/content-intelligence.engine";
import { JourneyGenomeEngine } from "./ai/journey-genome.engine";
import { GrowthDashboardService } from "./services/growth-dashboard.service";

@Controller("growth-network-effect")
export class GrowthNetworkEffectController {
  constructor(
    private readonly os:GrowthNetworkEffectService,
    private readonly brain:GrowthBrainEngine,
    private readonly retentionAi:RetentionAiEngine,
    private readonly revenueAi:RevenueOptimizerEngine,
    private readonly viral:ViralEngine,
    private readonly seoAi:SeoIntelligenceEngine,
    private readonly competitorAi:CompetitorIntelligenceEngine,
    private readonly contentAi:ContentIntelligenceEngine,
    private readonly journeyAi:JourneyGenomeEngine,
    private readonly dashboard:GrowthDashboardService,
  ){}
  @Get("health") health(){return {success:true,system:"AVOS Growth, Marketing & Network Effect OS",status:"healthy"};}
  @Post("campaigns") campaign(@Body() b:any){return {success:true,campaign:this.os.campaigns.create(b)};}
  @Post("referrals") referral(@Body() b:any){return {success:true,referral:this.os.referrals.create(b)};}
  @Post("seo") seo(@Body() b:any){return {success:true,page:this.os.seo.create(b)};}
  @Post("social") social(@Body() b:any){return {success:true,publication:this.os.social.publish(b)};}
  @Post("content") content(@Body() b:any){return {success:true,content:this.os.content.create(b)};}
  @Post("ab-tests") abTest(@Body() b:any){return {success:true,test:this.os.abTests.create(b)};}
  @Post("retention") retention(@Body() b:any){return {success:true,record:this.os.retention.record(b)};}
  @Post("revenue") revenue(@Body() b:any){return {success:true,record:this.os.revenue.record(b)};}
  @Post("influencers") influencer(@Body() b:any){return {success:true,influencer:this.os.influencers.create(b)};}
  @Post("competitors") competitor(@Body() b:any){return {success:true,record:this.os.competitors.record(b)};}
  @Post("journeys") journey(@Body() b:any){return {success:true,event:this.os.journeys.record(b)};}
  @Post("notifications") notification(@Body() b:any){return {success:true,rule:this.os.notifications.create(b)};}
  @Post("ai/growth-brain") growthBrain(@Body() b:any){return this.brain.evaluate(b);}
  @Post("ai/retention") retentionPrediction(@Body() b:any){return this.retentionAi.predict(b);}
  @Post("ai/revenue") revenueOptimization(@Body() b:any){return this.revenueAi.optimize(b);}
  @Post("ai/viral") viralEvaluation(@Body() b:any){return this.viral.calculate(b);}
  @Post("ai/seo") seoEvaluation(@Body() b:any){return this.seoAi.analyze(b);}
  @Post("ai/competitor") competitorEvaluation(@Body() b:any){return this.competitorAi.compare(b);}
  @Post("ai/content") contentEvaluation(@Body() b:any){return this.contentAi.score(b);}
  @Post("ai/journey") journeyEvaluation(@Body() b:any){return this.journeyAi.analyze(b.stages??[]);}
  @Get("operations/dashboard") operations(){return {success:true,dashboard:this.dashboard.summary()};}
}
