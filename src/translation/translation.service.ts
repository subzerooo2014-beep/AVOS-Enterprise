import { Injectable } from "@nestjs/common";

@Injectable()
export class TranslationService {
  findAll(){ return []; }
  create(dto:any){ return dto; }
}
