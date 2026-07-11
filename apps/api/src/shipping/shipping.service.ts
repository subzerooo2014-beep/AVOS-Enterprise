import { Injectable } from "@nestjs/common";

@Injectable()
export class ShippingService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
