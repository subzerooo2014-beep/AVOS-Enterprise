import { Injectable } from "@nestjs/common";

@Injectable()
export class DevicesService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
