import { Injectable } from "@nestjs/common";

@Injectable()
export class WarehousesService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
