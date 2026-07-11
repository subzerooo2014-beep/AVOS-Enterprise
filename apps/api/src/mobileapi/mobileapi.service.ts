import { Injectable } from "@nestjs/common";

@Injectable()
export class MobileapiService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
