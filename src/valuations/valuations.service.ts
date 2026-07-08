import { Injectable } from "@nestjs/common";

@Injectable()
export class ValuationsService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
