import { Injectable } from "@nestjs/common";

@Injectable()
export class CustomerportalService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
