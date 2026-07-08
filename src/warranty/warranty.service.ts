import { Injectable } from "@nestjs/common";

@Injectable()
export class WarrantyService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
