import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  FinanceApplication,
  FinanceOffer,
  FraudAssessment,
  InsuranceClaim,
  InsurancePolicy,
  InsuranceQuote,
  ValuationRequest,
  ValuationResult,
} from "./industry-intelligence-finance.types";
import {
  INDUSTRY_INTELLIGENCE_FINANCE_COMPONENTS,
  SUPPORTED_INTELLIGENCE_INDUSTRIES,
} from "./industry-intelligence-finance.registry";

@Injectable()
export class IndustryIntelligenceFinanceService {
  private readonly valuations = new Map<string, ValuationResult>();
  private readonly fraudAssessments = new Map<string, FraudAssessment>();
  private readonly quotes = new Map<string, InsuranceQuote>();
  private readonly policies = new Map<string, InsurancePolicy>();
  private readonly claims = new Map<string, InsuranceClaim>();
  private readonly applications = new Map<string, FinanceApplication>();
  private readonly offers = new Map<string, FinanceOffer>();

  components() {
    return {
      system: "AVOS Industry Intelligence, Finance & Insurance Core",
      architecture: "INDUSTRY_BASED",
      components: [...INDUSTRY_INTELLIGENCE_FINANCE_COMPONENTS],
      industries: [...SUPPORTED_INTELLIGENCE_INDUSTRIES],
      status: "READY",
    };
  }

  valuate(request: ValuationRequest): ValuationResult {
    this.requireIndustry(request.industryKey);
    const values = Object.values(request.marketSignals ?? {});
    const average = values.length === 0 ? 0 : values.reduce((a,b)=>a+b,0)/values.length;
    const estimatedValue = Number(Math.max(average + Object.keys(request.attributes).length * 250,0).toFixed(2));

    const result: ValuationResult = {
      id: randomUUID(),
      industryKey: request.industryKey,
      tenantId: request.tenantId,
      assetId: request.assetId,
      estimatedValue,
      currency: "AED",
      confidence: Math.min(95,60+Object.keys(request.attributes).length*3),
      factors: ["industry","asset attributes","market signals","condition proxy"],
      createdAt: new Date().toISOString(),
    };

    this.valuations.set(result.id,result);
    return {...result,factors:[...result.factors]};
  }

  match(industryKey:string,buyerProfile:Record<string,unknown>,candidates:Array<{entityId:string;entityType:string;attributes:Record<string,unknown>}>) {
    this.requireIndustry(industryKey);
    const keys=Object.keys(buyerProfile);

    return candidates.map(candidate=>{
      const overlap=Object.keys(candidate.attributes).filter(key=>keys.includes(key)).length;
      return {
        entityId:candidate.entityId,
        entityType:candidate.entityType,
        score:Math.min(100,50+overlap*10),
        reasons:["industry compatibility","attribute overlap","buyer preference fit"],
      };
    }).sort((a,b)=>b.score-a.score);
  }

  assessFraud(industryKey:string,tenantId:string,entityId:string,signals:Record<string,number>):FraudAssessment {
    this.requireIndustry(industryKey);
    const riskScore=Math.min(100,Object.values(signals).reduce((sum,value)=>sum+value,0));
    const riskLevel:FraudAssessment["riskLevel"]=riskScore>=85?"CRITICAL":riskScore>=65?"HIGH":riskScore>=35?"MEDIUM":"LOW";

    const result:FraudAssessment={
      id:randomUUID(),
      industryKey,
      tenantId,
      entityId,
      riskScore,
      riskLevel,
      signals:Object.keys(signals),
      blocked:riskLevel==="CRITICAL",
      createdAt:new Date().toISOString(),
    };

    this.fraudAssessments.set(result.id,result);
    return {...result,signals:[...result.signals]};
  }

  createInsuranceQuote(input:Omit<InsuranceQuote,"id"|"status"|"createdAt"|"updatedAt">):InsuranceQuote {
    this.requireIndustry(input.industryKey);
    const now=new Date().toISOString();
    const quote:InsuranceQuote={...input,id:randomUUID(),coverage:[...input.coverage],status:"QUOTED",createdAt:now,updatedAt:now};
    this.quotes.set(quote.id,quote);
    return {...quote,coverage:[...quote.coverage]};
  }

  acceptInsuranceQuote(id:string,policyNumber:string,validFrom:string,validTo:string):InsurancePolicy {
    const quote=this.requireQuote(id);
    quote.status="ACCEPTED";
    quote.updatedAt=new Date().toISOString();

    const now=new Date().toISOString();
    const policy:InsurancePolicy={id:randomUUID(),quoteId:id,policyNumber,status:"ACTIVE",validFrom,validTo,createdAt:now,updatedAt:now};
    this.policies.set(policy.id,policy);
    return {...policy};
  }

  createInsuranceClaim(input:Omit<InsuranceClaim,"id"|"status"|"createdAt"|"updatedAt">):InsuranceClaim {
    this.requirePolicy(input.policyId);
    const now=new Date().toISOString();
    const claim:InsuranceClaim={...input,id:randomUUID(),status:"SUBMITTED",createdAt:now,updatedAt:now};
    this.claims.set(claim.id,claim);
    return {...claim};
  }

  approveInsuranceClaim(id:string):InsuranceClaim {
    const claim=this.requireClaim(id);
    claim.status="APPROVED";
    claim.updatedAt=new Date().toISOString();
    return {...claim};
  }

  createFinanceApplication(input:Omit<FinanceApplication,"id"|"status"|"createdAt"|"updatedAt">):FinanceApplication {
    this.requireIndustry(input.industryKey);
    const now=new Date().toISOString();
    const app:FinanceApplication={...input,id:randomUUID(),status:"SUBMITTED",createdAt:now,updatedAt:now};
    this.applications.set(app.id,app);
    return {...app};
  }

  preApproveFinance(applicationId:string,providerId:string,approvedAmount:number,annualRate:number):FinanceOffer {
    const app=this.requireApplication(applicationId);
    app.status="PRE_APPROVED";
    app.updatedAt=new Date().toISOString();

    const monthlyRate=annualRate/100/12;
    const principal=approvedAmount-app.downPayment;
    const monthlyInstallment=monthlyRate===0
      ? principal/app.termMonths
      : (principal*monthlyRate*Math.pow(1+monthlyRate,app.termMonths))/(Math.pow(1+monthlyRate,app.termMonths)-1);

    const now=new Date().toISOString();
    const offer:FinanceOffer={
      id:randomUUID(),
      applicationId,
      providerId,
      approvedAmount,
      annualRate,
      termMonths:app.termMonths,
      monthlyInstallment:Number(monthlyInstallment.toFixed(2)),
      currency:app.currency,
      status:"OFFERED",
      createdAt:now,
      updatedAt:now,
    };

    this.offers.set(offer.id,offer);
    return {...offer};
  }

  acceptFinanceOffer(id:string):FinanceOffer {
    const offer=this.requireFinanceOffer(id);
    offer.status="ACCEPTED";
    offer.updatedAt=new Date().toISOString();
    const app=this.requireApplication(offer.applicationId);
    app.status="APPROVED";
    app.updatedAt=new Date().toISOString();
    return {...offer};
  }

  dashboard() {
    return {
      system:"AVOS Industry Intelligence, Finance & Insurance Core",
      architecture:"INDUSTRY_BASED",
      valuations:this.valuations.size,
      fraudAssessments:this.fraudAssessments.size,
      insuranceQuotes:this.quotes.size,
      policies:this.policies.size,
      claims:this.claims.size,
      financeApplications:this.applications.size,
      financeOffers:this.offers.size,
      components:INDUSTRY_INTELLIGENCE_FINANCE_COMPONENTS.length,
      generatedAt:new Date().toISOString(),
    };
  }

  private requireIndustry(key:string) {
    if(!SUPPORTED_INTELLIGENCE_INDUSTRIES.includes(key as (typeof SUPPORTED_INTELLIGENCE_INDUSTRIES)[number])) {
      throw new Error(`Unsupported industry: ${key}`);
    }
  }

  private requireQuote(id:string) {
    const value=this.quotes.get(id);
    if(!value) throw new Error(`Insurance quote not found: ${id}`);
    return value;
  }

  private requirePolicy(id:string) {
    const value=this.policies.get(id);
    if(!value) throw new Error(`Insurance policy not found: ${id}`);
    return value;
  }

  private requireClaim(id:string) {
    const value=this.claims.get(id);
    if(!value) throw new Error(`Insurance claim not found: ${id}`);
    return value;
  }

  private requireApplication(id:string) {
    const value=this.applications.get(id);
    if(!value) throw new Error(`Finance application not found: ${id}`);
    return value;
  }

  private requireFinanceOffer(id:string) {
    const value=this.offers.get(id);
    if(!value) throw new Error(`Finance offer not found: ${id}`);
    return value;
  }
}