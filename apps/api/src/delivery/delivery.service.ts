import { Injectable } from "@nestjs/common";

@Injectable()
export class DeliveryService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
