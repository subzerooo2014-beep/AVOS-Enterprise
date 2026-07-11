import { Injectable } from "@nestjs/common";

@Injectable()
export class ApiService{
 findAll(){ return []; }
 create(dto:any){ return dto; }
}
