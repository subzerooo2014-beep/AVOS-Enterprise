import { Injectable } from "@nestjs/common";

@Injectable()
export class FeatureflagsService{
 findAll(){ return []; }
 create(dto:any){ return dto; }
}
