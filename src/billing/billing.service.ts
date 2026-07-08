import { Injectable } from "@nestjs/common";

@Injectable()
export class BillingService{
 findAll(){ return []; }
 create(dto:any){ return dto; }
}
