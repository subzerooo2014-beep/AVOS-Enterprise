import { Injectable } from "@nestjs/common";

@Injectable()
export class VendorsService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
