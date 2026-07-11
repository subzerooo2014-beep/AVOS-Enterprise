import { Injectable } from "@nestjs/common";

@Injectable()
export class PricingService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
