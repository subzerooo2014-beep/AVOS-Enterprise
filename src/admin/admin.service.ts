import { Injectable } from "@nestjs/common";

@Injectable()
export class AdminService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
