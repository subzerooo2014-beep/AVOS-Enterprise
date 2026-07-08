import { Injectable } from "@nestjs/common";

@Injectable()
export class AppointmentsService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
