import { Module } from '@nestjs/common';
import { VehicleFinanceCommerceController } from './vehicle-finance-commerce.controller';
import { PaymentOrchestrationEngineService } from './payment-orchestration-engine.service';
import { VehicleDepositReservationEngineService } from './vehicle-deposit-reservation-engine.service';
import { FinancingApplicationEngineService } from './financing-application-engine.service';
import { InsuranceQuotationEngineService } from './insurance-quotation-engine.service';
import { ContractGenerationEngineService } from './contract-generation-engine.service';
import { DigitalSignatureCoordinatorService } from './digital-signature-coordinator.service';
import { CommissionFeeCalculatorService } from './commission-fee-calculator.service';
import { RefundSettlementEngineService } from './refund-settlement-engine.service';
import { FinancialRiskCheckEngineService } from './financial-risk-check-engine.service';
import { TransactionAuditTrailService } from './transaction-audit-trail.service';
import { PurchaseFlowOrchestratorService } from './purchase-flow-orchestrator.service';
import { FinanceCommerceDashboardService } from './finance-commerce-dashboard.service';

@Module({
  controllers: [VehicleFinanceCommerceController],
  providers: [
    PaymentOrchestrationEngineService,
    VehicleDepositReservationEngineService,
    FinancingApplicationEngineService,
    InsuranceQuotationEngineService,
    ContractGenerationEngineService,
    DigitalSignatureCoordinatorService,
    CommissionFeeCalculatorService,
    RefundSettlementEngineService,
    FinancialRiskCheckEngineService,
    TransactionAuditTrailService,
    PurchaseFlowOrchestratorService,
    FinanceCommerceDashboardService,
  ],
  exports: [
    PaymentOrchestrationEngineService,
    VehicleDepositReservationEngineService,
    FinancingApplicationEngineService,
    InsuranceQuotationEngineService,
    ContractGenerationEngineService,
    DigitalSignatureCoordinatorService,
    CommissionFeeCalculatorService,
    RefundSettlementEngineService,
    FinancialRiskCheckEngineService,
    TransactionAuditTrailService,
    PurchaseFlowOrchestratorService,
    FinanceCommerceDashboardService,
  ],
})
export class VehicleFinanceCommerceModule {}