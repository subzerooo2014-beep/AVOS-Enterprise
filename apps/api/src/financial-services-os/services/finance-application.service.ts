import { Injectable, NotFoundException } from "@nestjs/common";
import { FinanceApplicationPolicy } from "../policies/finance-application.policy";
import { FinanceApplicationRecord } from "../financial-services-os.types";
import { financeId } from "../financial-services-os.utils";
@Injectable()
export class FinanceApplicationService {
  private readonly records=new Map<string,FinanceApplicationRecord>();
  constructor(private readonly policy:FinanceApplicationPolicy){}
  create(input:any){this.policy.validate(input.amount,input.termMonths,input.income);const now=new Date().toISOString();const r:FinanceApplicationRecord={id:financeId("finance"),customerId:input.customerId,vehicleId:input.vehicleId,amount:input.amount,termMonths:input.termMonths,status:"PENDING",createdAt:now,updatedAt:now};this.records.set(r.id,r);return r;}
  approve(id:string,input:any){const r=this.records.get(id);if(!r)throw new NotFoundException("Application not found");r.status="APPROVED";r.interestRate=input.interestRate;r.amount=input.approvedAmount;r.updatedAt=new Date().toISOString();return r;}
  list(){return [...this.records.values()];}
}
