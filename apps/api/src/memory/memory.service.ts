import { Injectable } from "@nestjs/common";

@Injectable()
export class MemoryService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
