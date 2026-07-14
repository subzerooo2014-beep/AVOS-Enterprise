import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { FinancialServicesOsService } from "./financial-services-os.service";
import { FinancialRiskEngine } from "./ai/financial-risk.engine";
import { FinancialFraudDetectionEngine } from "./ai/fraud-detection.engine";
import { InsurancePricingEngine } from "./ai/insurance-pricing.engine";
import { ClaimIntelligenceEngine } from "./ai/claim-intelligence.engine";
import { RevenueAssuranceEngine } from "./ai/revenue-assurance.engine";
import { SettlementOptimizationEngine } from "./ai/settlement-optimization.engine";
import { LoanPricingEngine } from "./ai/loan-pricing.engine";
import { FinancialAnalyticsEngine } from "./ai/financial-analytics.engine";
import { FinancialDashboardService } from "./services/financial-dashboard.service";

@Controller("financial-services-os")
export class FinancialServicesOsController {
  constructor(
    private readonly os:FinancialServicesOsService,
    private readonly risk:FinancialRiskEngine,
    private readonly fraud:FinancialFraudDetectionEngine,
    private readonly insurancePricing:InsurancePricingEngine,
    private readonly claimAi:ClaimIntelligenceEngine,
    private readonly revenueAi:RevenueAssuranceEngine,
    private readonly settlementAi:SettlementOptimizationEngine,
    private readonly loanPricing:LoanPricingEngine,
    private readonly analytics:FinancialAnalyticsEngine,
    private readonly dashboard:FinancialDashboardService,
  ){}
  @Get("health") health(){return {success:true,system:"AVOS Financial Services, Payments & Insurance OS",status:"healthy"};}
  @Post("finance-applications") finance(@Body() b:any){return {success:true,application:this.os.finance.create(b)};}
  @Post("finance-applications/:id/approve") approveFinance(@Param("id") id:string,@Body() b:any){return {success:true,application:this.os.finance.approve(id,b)};}
  @Post("installments") installment(@Body() b:any){return {success:true,plan:this.os.installments.create(b)};}
  @Post("payments") payment(@Body() b:any){return {success:true,payment:this.os.payments.create(b)};}
  @Post("payments/:id/refund") refund(@Param("id") id:string,@Body() b:any){return {success:true,refund:this.os.payments.refund(id,b.amount,b.reason)};}
  @Post("wallets") wallet(@Body() b:any){return {success:true,wallet:this.os.wallets.create(b.ownerId,b.currency)};}
  @Post("wallets/:id/credit") walletCredit(@Param("id") id:string,@Body() b:any){return {success:true,wallet:this.os.wallets.credit(id,b.amount)};}
  @Post("wallets/:id/debit") walletDebit(@Param("id") id:string,@Body() b:any){return {success:true,wallet:this.os.wallets.debit(id,b.amount)};}
  @Post("escrow") escrow(@Body() b:any){return {success:true,escrow:this.os.escrow.create(b)};}
  @Post("escrow/:id/release") releaseEscrow(@Param("id") id:string,@Body() b:any){return {success:true,escrow:this.os.escrow.release(id,b.approvalReference)};}
  @Post("insurance/quotes") quote(@Body() b:any){return {success:true,quote:this.os.quotes.create(b)};}
  @Post("insurance/policies") policy(@Body() b:any){return {success:true,policy:this.os.policies.create(b)};}
  @Post("insurance/claims") claim(@Body() b:any){return {success:true,claim:this.os.claims.create(b)};}
  @Post("kyc") kyc(@Body() b:any){return this.os.kyc.run(b);}
  @Post("aml") aml(@Body() b:any){return this.os.aml.run(b);}
  @Post("settlements") settlement(@Body() b:any){return {success:true,settlement:this.os.settlements.create(b)};}
  @Post("revenue-assurance") revenueAssurance(@Body() b:any){return {success:true,record:this.os.revenueAssurance.record(b)};}
  @Post("accounting-sync") accounting(@Body() b:any){return {success:true,sync:this.os.accounting.sync(b)};}
  @Post("ai/risk") riskScore(@Body() b:any){return this.risk.evaluate(b);}
  @Post("ai/fraud") fraudScore(@Body() b:any){return this.fraud.evaluate(b);}
  @Post("ai/insurance-pricing") insurancePrice(@Body() b:any){return this.insurancePricing.calculate(b);}
  @Post("ai/claim") claimEvaluation(@Body() b:any){return this.claimAi.evaluate(b);}
  @Post("ai/revenue-assurance") revenueEvaluation(@Body() b:any){return this.revenueAi.analyze(b);}
  @Post("ai/settlement") settlementEvaluation(@Body() b:any){return this.settlementAi.calculate(b);}
  @Post("ai/loan-pricing") loanPrice(@Body() b:any){return this.loanPricing.calculate(b);}
  @Post("ai/analytics") financialAnalytics(@Body() b:any){return this.analytics.summarize(b);}
  @Get("operations/dashboard") operations(){return {success:true,dashboard:this.dashboard.summary()};}
}
