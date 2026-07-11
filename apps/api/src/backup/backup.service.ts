import { Injectable } from "@nestjs/common";

@Injectable()
export class BackupService{
 findAll(){ return []; }
 create(dto:any){ return dto; }
}
