import { Injectable } from "@nestjs/common";
import { FinanceApplicationService } from "./finance-application.service";
import { PaymentService } from "./payment.service";
import { InsurancePolicyService } from "./insurance-policy.service";
import { InsuranceClaimService } from "./insurance-claim.service";
@Injectable()
export class FinancialDashboardService {
  constructor(private readonly finance:FinanceApplicationService,private readonly payments:PaymentService,private readonly policies:InsurancePolicyService,private readonly claims:InsuranceClaimService){}
  summary(){return {applications:this.finance.list().length,payments:this.payments.list().length,policies:this.policies.list().length,claims:this.claims.list().length};}
}
