import { Injectable } from "@nestjs/common";

@Injectable()
export class DiscountsService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
