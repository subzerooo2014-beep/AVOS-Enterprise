import { Module } from "@nestjs/common";
import { FinancialServicesOsController } from "./financial-services-os.controller";
import { FinancialServicesOsService } from "./financial-services-os.service";
import { FinanceApplicationPolicy } from "./policies/finance-application.policy";
import { PaymentPolicy } from "./policies/payment.policy";
import { WalletPolicy } from "./policies/wallet.policy";
import { EscrowPolicy } from "./policies/escrow.policy";
import { InsurancePolicy } from "./policies/insurance.policy";
import { ClaimPolicy } from "./policies/claim.policy";
import { KycAmlPolicy } from "./policies/kyc-aml.policy";
import { SettlementPolicy } from "./policies/settlement.policy";
import { FinanceApplicationService } from "./services/finance-application.service";
import { InstallmentService } from "./services/installment.service";
import { PaymentService } from "./services/payment.service";
import { WalletService } from "./services/wallet.service";
import { EscrowService } from "./services/escrow.service";
import { InsuranceQuoteService } from "./services/insurance-quote.service";
import { InsurancePolicyService } from "./services/insurance-policy.service";
import { InsuranceClaimService } from "./services/insurance-claim.service";
import { KycService } from "./services/kyc.service";
import { AmlService } from "./services/aml.service";
import { FinancialSettlementService } from "./services/settlement.service";
import { RevenueAssuranceService } from "./services/revenue-assurance.service";
import { AccountingSyncService } from "./services/accounting-sync.service";
import { FinancialAuditService } from "./services/financial-audit.service";
import { FinancialAlertService } from "./services/financial-alert.service";
import { FinancialReportingService } from "./services/financial-reporting.service";
import { PaymentGatewayService } from "./services/payment-gateway.service";
import { InsuranceMarketplaceService } from "./services/insurance-marketplace.service";
import { FinanceMarketplaceService } from "./services/finance-marketplace.service";
import { FinancialDashboardService } from "./services/financial-dashboard.service";
import { FinancialRiskEngine } from "./ai/financial-risk.engine";
import { FinancialFraudDetectionEngine } from "./ai/fraud-detection.engine";
import { InsurancePricingEngine } from "./ai/insurance-pricing.engine";
import { ClaimIntelligenceEngine } from "./ai/claim-intelligence.engine";
import { RevenueAssuranceEngine } from "./ai/revenue-assurance.engine";
import { SettlementOptimizationEngine } from "./ai/settlement-optimization.engine";
import { LoanPricingEngine } from "./ai/loan-pricing.engine";
import { FinancialAnalyticsEngine } from "./ai/financial-analytics.engine";

@Module({
 controllers:[FinancialServicesOsController],
 providers:[
  FinancialServicesOsService,
  FinanceApplicationPolicy,PaymentPolicy,WalletPolicy,EscrowPolicy,InsurancePolicy,ClaimPolicy,KycAmlPolicy,SettlementPolicy,
  FinanceApplicationService,InstallmentService,PaymentService,WalletService,EscrowService,InsuranceQuoteService,
  InsurancePolicyService,InsuranceClaimService,KycService,AmlService,FinancialSettlementService,RevenueAssuranceService,
  AccountingSyncService,FinancialAuditService,FinancialAlertService,FinancialReportingService,PaymentGatewayService,
  InsuranceMarketplaceService,FinanceMarketplaceService,FinancialDashboardService,
  FinancialRiskEngine,FinancialFraudDetectionEngine,InsurancePricingEngine,ClaimIntelligenceEngine,
  RevenueAssuranceEngine,SettlementOptimizationEngine,LoanPricingEngine,FinancialAnalyticsEngine
 ],
 exports:[FinancialServicesOsService],
})
export class FinancialServicesOsModule {}
