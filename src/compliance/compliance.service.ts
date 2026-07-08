import { Injectable } from "@nestjs/common";

@Injectable()
export class ComplianceService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
