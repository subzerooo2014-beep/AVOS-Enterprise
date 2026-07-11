import { Injectable } from "@nestjs/common";

@Injectable()
export class TicketsService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
