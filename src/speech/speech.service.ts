import { Injectable } from "@nestjs/common";

@Injectable()
export class SpeechService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
