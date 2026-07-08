import { Injectable } from "@nestjs/common";

@Injectable()
export class BranchescrmService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
