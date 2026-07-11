import { Injectable } from "@nestjs/common";

@Injectable()
export class RestoreService{
 findAll(){ return []; }
 create(dto:any){ return dto; }
}
