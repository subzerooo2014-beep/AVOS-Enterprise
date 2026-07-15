import { Injectable } from '@nestjs/common';
import {
  CommerceContract,
  FinancingApplication,
  InsuranceQuote,
  PaymentTransaction,
} from './vehicle-finance-commerce.types';
import { FinancialRiskCheckEngineService } from './financial-risk-check-engine.service';
import { CommissionFeeCalculatorService } from './commission-fee-calculator.service';
import { ContractGenerationEngineService } from './contract-generation-engine.service';
import { InsuranceQuotationEngineService } from './insurance-quotation-engine.service';

@Injectable()
export class PurchaseFlowOrchestratorService {
  constructor(
    private readonly risk: FinancialRiskCheckEngineService,
    private readonly fees: CommissionFeeCalculatorService,
    private readonly contracts: ContractGenerationEngineService,
    private readonly insurance: InsuranceQuotationEngineService,
  ) {}

  run(input: {
    payment: PaymentTransaction;
    financing?: FinancingApplication;
    quotes: InsuranceQuote[];
    contract: Omit<CommerceContract, 'status'>;
    riskSignals: Array<{
      id: string;
      subjectId: string;
      type: string;
      score: number;
      evidence: string[];
    }>;
  }) {
    const risk = this.risk.evaluate(input.riskSignals);
    const fees = this.fees.calculate({
      amount: input.payment.amount,
      commissionRate: 0.02,
      paymentFeeRate: 0.015,
      fixedFee: 10,
    });
    const contract = risk.blocked
      ? null
      : this.contracts.generate(input.contract);
    const insurance = this.insurance.rank(input.quotes);

    return {
      risk,
      fees,
      financing: input.financing ?? null,
      contract,
      insurance,
      approved: !risk.blocked && Boolean(contract),
    };
  }
}