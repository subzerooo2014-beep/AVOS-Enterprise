import { Injectable } from "@nestjs/common";

@Injectable()
export class EmployeesService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
