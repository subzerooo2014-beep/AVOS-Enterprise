import { Injectable } from "@nestjs/common";

@Injectable()
export class WorkordersService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
