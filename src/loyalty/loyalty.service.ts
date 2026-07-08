import { Injectable } from "@nestjs/common";

@Injectable()
export class LoyaltyService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
