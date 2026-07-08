import { Injectable } from "@nestjs/common";

@Injectable()
export class ToolsService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
