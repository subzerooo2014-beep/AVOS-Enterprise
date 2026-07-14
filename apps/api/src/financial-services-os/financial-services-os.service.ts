import { Injectable } from "@nestjs/common";
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
@Injectable()
export class FinancialServicesOsService {
  constructor(
    readonly finance:FinanceApplicationService,readonly installments:InstallmentService,readonly payments:PaymentService,
    readonly wallets:WalletService,readonly escrow:EscrowService,readonly quotes:InsuranceQuoteService,
    readonly policies:InsurancePolicyService,readonly claims:InsuranceClaimService,readonly kyc:KycService,
    readonly aml:AmlService,readonly settlements:FinancialSettlementService,readonly revenueAssurance:RevenueAssuranceService,
    readonly accounting:AccountingSyncService
  ){}
}
