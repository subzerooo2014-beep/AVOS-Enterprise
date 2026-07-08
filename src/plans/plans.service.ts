import { Injectable } from "@nestjs/common";

@Injectable()
export class PlansService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
