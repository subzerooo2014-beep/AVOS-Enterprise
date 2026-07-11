import { Injectable } from "@nestjs/common";

@Injectable()
export class DocumentsService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
