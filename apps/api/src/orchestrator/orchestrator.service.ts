import { Injectable } from "@nestjs/common";

@Injectable()
export class OrchestratorService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
