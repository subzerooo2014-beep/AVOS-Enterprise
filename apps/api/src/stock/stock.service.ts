import { Injectable } from "@nestjs/common";

@Injectable()
export class StockService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
