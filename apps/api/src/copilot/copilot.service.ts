import { Injectable } from "@nestjs/common";

@Injectable()
export class CopilotService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
