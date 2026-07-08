import { Injectable } from "@nestjs/common";

@Injectable()
export class TrackingService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
