import { Injectable } from "@nestjs/common";

@Injectable()
export class InspectionsService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
