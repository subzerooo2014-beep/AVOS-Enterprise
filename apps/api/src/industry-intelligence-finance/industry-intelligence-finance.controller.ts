import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { IndustryIntelligenceFinanceService } from "./industry-intelligence-finance.service";
import {
  FinanceApplication,
  InsuranceClaim,
  InsuranceQuote,
  ValuationRequest,
} from "./industry-intelligence-finance.types";

@Controller("industry-intelligence-finance")
export class IndustryIntelligenceFinanceController {
  constructor(private readonly service: IndustryIntelligenceFinanceService) {}

  @Get("components")
  components(){return this.service.components();}

  @Post("valuations")
  valuate(@Body() input:ValuationRequest){return this.service.valuate(input);}

  @Post("matching")
  match(@Body() body:{industryKey:string;buyerProfile:Record<string,unknown>;candidates:Array<{entityId:string;entityType:string;attributes:Record<string,unknown>}>}) {
    return this.service.match(body.industryKey,body.buyerProfile,body.candidates);
  }

  @Post("fraud-assessments")
  assessFraud(@Body() body:{industryKey:string;tenantId:string;entityId:string;signals:Record<string,number>}) {
    return this.service.assessFraud(body.industryKey,body.tenantId,body.entityId,body.signals);
  }

  @Post("insurance/quotes")
  createInsuranceQuote(@Body() input:Omit<InsuranceQuote,"id"|"status"|"createdAt"|"updatedAt">) {
    return this.service.createInsuranceQuote(input);
  }

  @Patch("insurance/quotes/:id/accept")
  acceptInsuranceQuote(@Param("id") id:string,@Body() body:{policyNumber:string;validFrom:string;validTo:string}) {
    return this.service.acceptInsuranceQuote(id,body.policyNumber,body.validFrom,body.validTo);
  }

  @Post("insurance/claims")
  createInsuranceClaim(@Body() input:Omit<InsuranceClaim,"id"|"status"|"createdAt"|"updatedAt">) {
    return this.service.createInsuranceClaim(input);
  }

  @Patch("insurance/claims/:id/approve")
  approveInsuranceClaim(@Param("id") id:string){return this.service.approveInsuranceClaim(id);}

  @Post("finance/applications")
  createFinanceApplication(@Body() input:Omit<FinanceApplication,"id"|"status"|"createdAt"|"updatedAt">) {
    return this.service.createFinanceApplication(input);
  }

  @Patch("finance/applications/:id/pre-approve")
  preApproveFinance(@Param("id") id:string,@Body() body:{providerId:string;approvedAmount:number;annualRate:number}) {
    return this.service.preApproveFinance(id,body.providerId,body.approvedAmount,body.annualRate);
  }

  @Patch("finance/offers/:id/accept")
  acceptFinanceOffer(@Param("id") id:string){return this.service.acceptFinanceOffer(id);}

  @Get("dashboard")
  dashboard(){return this.service.dashboard();}
}