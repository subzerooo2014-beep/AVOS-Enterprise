import { Injectable } from "@nestjs/common";

@Injectable()
export class VectordbService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
