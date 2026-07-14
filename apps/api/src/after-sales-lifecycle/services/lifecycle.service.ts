import { Injectable } from "@nestjs/common";
import { LifecyclePolicy } from "../policies/lifecycle.policy";
import { LifecycleRepositoryService } from "./lifecycle-repository.service";
import { lifecycleId } from "../after-sales-lifecycle.utils";
@Injectable()
export class LifecycleService {
  constructor(private readonly policy:LifecyclePolicy,private readonly repo:LifecycleRepositoryService){}
  create(input:{vehicleId:string;ownerId:string;odometer:number}) {
    this.policy.validate(input.odometer);
    const now=new Date().toISOString();
    return this.repo.save({id:lifecycleId("lifecycle"),...input,status:"ACTIVE",healthScore:100,warrantyActive:false,serviceCount:0,recallCount:0,createdAt:now,updatedAt:now});
  }
}
