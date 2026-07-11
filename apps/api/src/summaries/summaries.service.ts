import { Injectable } from "@nestjs/common";

@Injectable()
export class SummariesService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
