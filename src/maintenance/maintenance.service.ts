import { Injectable } from "@nestjs/common";

@Injectable()
export class MaintenanceService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
