
import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { CreateMemoryDto, SearchMemoryDto } from "./dto/enterprise-memory.dto";
import { EnterpriseMemoryService } from "./services/enterprise-memory.service";

@Controller("avos/enterprise-memory")
export class EnterpriseMemoryController {
  constructor(private readonly memory: EnterpriseMemoryService) {}

  @Get("health") health() { return this.memory.health(); }
  @Get("records") records(@Query("kind") kind?: string) { return this.memory.list(kind); }
  @Post("records") create(@Body() dto: CreateMemoryDto) { return this.memory.create(dto); }
  @Post("search") search(@Body() dto: SearchMemoryDto) { return this.memory.search(dto); }
  @Post("consolidate") consolidate() { return this.memory.consolidate(); }
  @Post("final-review/run") review() { return this.memory.review(); }
  @Post("certification/certify") certify() { return this.memory.certify(); }
  @Get("certification/status") status() {
    return { review: this.memory.review(), certification: this.memory.certify(), health: this.memory.health() };
  }
}