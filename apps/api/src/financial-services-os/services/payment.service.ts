import { Injectable, NotFoundException } from "@nestjs/common";
import { PaymentPolicy } from "../policies/payment.policy";
@Injectable()
export class PaymentService {
  private readonly records=new Map<string,Record<string,unknown>>();
  constructor(private readonly policy:PaymentPolicy){}
  create(input:any){this.policy.validate(input.amount,input.payerId,input.payeeId);const r={id:`payment_${Date.now()}`,...input,currency:input.currency??"AED",status:"COMPLETED",createdAt:new Date().toISOString()};this.records.set(String(r.id),r);return r;}
  refund(id:string,amount:number,reason:string){const r=this.records.get(id);if(!r)throw new NotFoundException("Payment not found");return {id:`refund_${Date.now()}`,paymentId:id,amount,reason,status:"COMPLETED"};}
  list(){return [...this.records.values()];}
}
