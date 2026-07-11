import { Injectable } from "@nestjs/common";

@Injectable()
export class ExtensionsService{
 findAll(){ return []; }
 create(dto:any){ return dto; }
}
