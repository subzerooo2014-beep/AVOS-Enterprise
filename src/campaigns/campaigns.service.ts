import { Injectable } from "@nestjs/common";

@Injectable()
export class CampaignsService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
