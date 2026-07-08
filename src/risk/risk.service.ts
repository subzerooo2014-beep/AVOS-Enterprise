import { Injectable } from "@nestjs/common";

@Injectable()
export class RiskService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
