import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateEnterpriseDecisionDto, EvaluateDecisionDto, SelectDecisionOptionDto } from "./dto/enterprise-decision-intelligence.dto";
import { EnterpriseDecisionIntelligenceService } from "./services/enterprise-decision-intelligence.service";

@Controller("avos/decision-intelligence")
export class EnterpriseDecisionIntelligenceController {
  constructor(private readonly service: EnterpriseDecisionIntelligenceService) {}
  @Get("status") status() { return this.service.status(); }
  @Get("decisions") findAll() { return this.service.findAll(); }
  @Get("decisions/:id") findById(@Param("id") id: string) { return this.service.findById(id); }
  @Post("decisions") create(@Body() dto: CreateEnterpriseDecisionDto) { return this.service.create(dto); }
  @Post("decisions/:id/evaluate") evaluate(@Param("id") id: string, @Body() dto: EvaluateDecisionDto) { return this.service.evaluate(id, dto); }
  @Post("decisions/:id/select") select(@Param("id") id: string, @Body() dto: SelectDecisionOptionDto) { return this.service.select(id, dto); }
  @Post("decisions/:id/execute") execute(@Param("id") id: string) { return this.service.execute(id); }
}