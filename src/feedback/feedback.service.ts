import { Injectable } from "@nestjs/common";

@Injectable()
export class FeedbackService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
