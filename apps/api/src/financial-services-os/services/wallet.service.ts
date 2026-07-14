import { Injectable, NotFoundException } from "@nestjs/common";
import { WalletPolicy } from "../policies/wallet.policy";
import { WalletRecord } from "../financial-services-os.types";
@Injectable()
export class WalletService {
  private readonly records=new Map<string,WalletRecord>();
  constructor(private readonly policy:WalletPolicy){}
  create(ownerId:string,currency="AED"){const now=new Date().toISOString();const r:WalletRecord={id:`wallet_${Date.now()}`,ownerId,balance:0,currency,status:"ACTIVE",createdAt:now,updatedAt:now};this.records.set(r.id,r);return r;}
  credit(id:string,amount:number){this.policy.validateAmount(amount);const r=this.get(id);r.balance+=amount;r.updatedAt=new Date().toISOString();return r;}
  debit(id:string,amount:number){this.policy.validateAmount(amount);const r=this.get(id);if(r.balance<amount)throw new Error("Insufficient balance");r.balance-=amount;r.updatedAt=new Date().toISOString();return r;}
  get(id:string){const r=this.records.get(id);if(!r)throw new NotFoundException("Wallet not found");return r;}
}
