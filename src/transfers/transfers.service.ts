import { Injectable } from "@nestjs/common";

@Injectable()
export class TransfersService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
