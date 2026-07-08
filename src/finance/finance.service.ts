import { Injectable } from "@nestjs/common";

@Injectable()
export class FinanceService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
