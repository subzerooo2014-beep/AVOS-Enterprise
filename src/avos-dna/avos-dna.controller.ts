import { Controller, Get, Post } from "@nestjs/common";
import { AvosDnaService } from "./avos-dna.service";

@Controller("avos-dna")
export class AvosDnaController {
  constructor(private service: AvosDnaService) {}

  @Post("seed")
  seed() {
    return this.service.seedDefaults();
  }

  @Get()
  list() {
    return this.service.list();
  }
}
