import { Injectable } from "@nestjs/common";

@Injectable()
export class EvaluationsService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
