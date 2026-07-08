import { Injectable } from "@nestjs/common";

@Injectable()
export class BanksService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
