import { Injectable } from "@nestjs/common";

@Injectable()
export class PermissionsService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
