import { Injectable } from "@nestjs/common";

@Injectable()
export class IntegrationscrmService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
