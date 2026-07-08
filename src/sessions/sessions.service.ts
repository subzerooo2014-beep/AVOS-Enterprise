import { Injectable } from "@nestjs/common";

@Injectable()
export class SessionsService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
