import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { WorkflowsService } from "./workflows.service";

@Controller("workflows")
export class WorkflowsController {
  constructor(private readonly service: WorkflowsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: any) {
    return this.service.create(dto);
  }

  @Patch(":id/steps/:stepName/complete")
  completeStep(
    @Param("id") id: string,
    @Param("stepName") stepName: string,
    @Body() dto: any,
  ) {
    return this.service.completeStep(id, stepName, dto?.output);
  }

  @Patch(":id/fail")
  fail(@Param("id") id: string, @Body() dto: any) {
    return this.service.fail(id, dto?.reason);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
