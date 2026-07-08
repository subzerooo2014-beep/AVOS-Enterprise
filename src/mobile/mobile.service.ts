import { Injectable } from "@nestjs/common";

@Injectable()
export class MobileService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
