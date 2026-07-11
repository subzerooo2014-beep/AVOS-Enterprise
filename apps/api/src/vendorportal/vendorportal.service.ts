import { Injectable } from "@nestjs/common";

@Injectable()
export class VendorportalService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
