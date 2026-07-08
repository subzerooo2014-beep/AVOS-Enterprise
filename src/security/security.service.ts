import { Injectable } from "@nestjs/common";

@Injectable()
export class SecurityService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
