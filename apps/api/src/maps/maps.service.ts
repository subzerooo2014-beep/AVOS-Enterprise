import { Injectable } from "@nestjs/common";

@Injectable()
export class MapsService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
