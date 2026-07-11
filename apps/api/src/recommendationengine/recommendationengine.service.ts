import { Injectable } from "@nestjs/common";

@Injectable()
export class RecommendationengineService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
