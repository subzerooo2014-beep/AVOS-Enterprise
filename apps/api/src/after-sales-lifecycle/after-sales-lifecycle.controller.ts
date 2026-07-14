import { Body, Controller, Get, Post } from "@nestjs/common";
import { AfterSalesLifecycleService } from "./after-sales-lifecycle.service";
import { LifecyclePredictiveMaintenanceEngine } from "./ai/predictive-maintenance.engine";
import { ResidualValueEngine } from "./ai/residual-value.engine";
import { WarrantyRiskEngine } from "./ai/warranty-risk.engine";
import { PartsDemandEngine } from "./ai/parts-demand.engine";
import { ServiceRecommendationEngine } from "./ai/service-recommendation.engine";
import { LifecycleHealthEngine } from "./ai/lifecycle-health.engine";
import { LoyaltyOptimizationEngine } from "./ai/loyalty-optimization.engine";
import { DealerNetworkEngine } from "./ai/dealer-network.engine";
import { LifecycleDashboardService } from "./services/lifecycle-dashboard.service";

@Controller("after-sales-lifecycle")
export class AfterSalesLifecycleController {
  constructor(
    private readonly os:AfterSalesLifecycleService,
    private readonly predictive:LifecyclePredictiveMaintenanceEngine,
    private readonly residual:ResidualValueEngine,
    private readonly warrantyRisk:WarrantyRiskEngine,
    private readonly partsDemand:PartsDemandEngine,
    private readonly recommendations:ServiceRecommendationEngine,
    private readonly health:LifecycleHealthEngine,
    private readonly loyaltyAi:LoyaltyOptimizationEngine,
    private readonly dealerAi:DealerNetworkEngine,
    private readonly dashboard:LifecycleDashboardService,
  ){}

  @Get("health") healthCheck(){return {success:true,system:"AVOS After-Sales & Vehicle Lifecycle OS",status:"healthy"};}
  @Post("lifecycles") lifecycle(@Body() body:any){return {success:true,lifecycle:this.os.lifecycle.create(body)};}
  @Post("maintenance") maintenance(@Body() body:any){return {success:true,maintenance:this.os.maintenance.schedule(body)};}
  @Post("warranties") warranty(@Body() body:any){return {success:true,warranty:this.os.warranties.create(body)};}
  @Post("warranty-claims") warrantyClaim(@Body() body:any){return {success:true,claim:this.os.warrantyClaims.create(body)};}
  @Post("service-history") serviceHistory(@Body() body:any){return {success:true,record:this.os.serviceHistory.record(body)};}
  @Post("recalls") recall(@Body() body:any){return {success:true,recall:this.os.recalls.create(body)};}
  @Post("parts") part(@Body() body:any){return {success:true,part:this.os.parts.create(body)};}
  @Post("part-orders") partOrder(@Body() body:any){return {success:true,order:this.os.partOrders.create(body)};}
  @Post("roadside") roadside(@Body() body:any){return {success:true,request:this.os.roadside.request(body)};}
  @Post("accidents") accident(@Body() body:any){return {success:true,accident:this.os.accidents.record(body)};}
  @Post("repairs") repair(@Body() body:any){return {success:true,repair:this.os.repairs.create(body)};}
  @Post("ownership") ownership(@Body() body:any){return {success:true,ownership:this.os.ownership.record(body)};}
  @Post("subscriptions") subscription(@Body() body:any){return {success:true,subscription:this.os.subscriptions.create(body)};}
  @Post("loyalty") loyalty(@Body() body:any){return {success:true,loyalty:this.os.loyalty.record(body)};}
  @Post("dealers") dealer(@Body() body:any){return {success:true,dealer:this.os.dealers.create(body)};}
  @Post("ai/predictive-maintenance") predictiveMaintenance(@Body() body:any){return this.predictive.evaluate(body);}
  @Post("ai/residual-value") residualValue(@Body() body:any){return this.residual.estimate(body);}
  @Post("ai/warranty-risk") warrantyRiskEval(@Body() body:any){return this.warrantyRisk.evaluate(body);}
  @Post("ai/parts-demand") partsDemandEval(@Body() body:any){return this.partsDemand.forecast(body.values??[]);}
  @Post("ai/service-recommendation") serviceRecommendation(@Body() body:any){return this.recommendations.recommend(body);}
  @Post("ai/health") lifecycleHealth(@Body() body:any){return this.health.calculate(body);}
  @Post("ai/loyalty") loyaltyOptimization(@Body() body:any){return this.loyaltyAi.evaluate(body);}
  @Post("ai/dealer-network") dealerNetwork(@Body() body:any){return this.dealerAi.rank(body.items??[]);}
  @Get("operations/dashboard") operations(){return {success:true,dashboard:this.dashboard.summary()};}
}
