import { Injectable } from "@nestjs/common";

@Injectable()
export class AttachmentsService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
