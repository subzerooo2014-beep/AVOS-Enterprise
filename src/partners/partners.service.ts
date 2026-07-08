import { Injectable } from "@nestjs/common";

@Injectable()
export class PartnersService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
