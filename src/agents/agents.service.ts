import { Injectable } from "@nestjs/common";

@Injectable()
export class AgentsService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
