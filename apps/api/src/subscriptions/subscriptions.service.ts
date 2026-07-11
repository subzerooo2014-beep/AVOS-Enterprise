import { Injectable } from "@nestjs/common";

@Injectable()
export class SubscriptionsService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
