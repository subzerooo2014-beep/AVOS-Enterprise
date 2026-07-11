import { Injectable } from "@nestjs/common";

@Injectable()
export class MultitenancyService{
 findAll(){ return []; }
 create(dto:any){ return dto; }
}
