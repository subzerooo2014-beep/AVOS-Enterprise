import { Injectable } from "@nestjs/common";

@Injectable()
export class LicensingService{
 findAll(){ return []; }
 create(dto:any){ return dto; }
}
