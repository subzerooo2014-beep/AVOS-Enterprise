import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { CrmService } from "./crm.service";
import { CreateCrmDto } from "./dto/create-crm.dto";
import { UpdateCrmDto } from "./dto/update-crm.dto";
import { BulkCrmDto } from "./dto/bulk-crm.dto";
import { CrmActivityDto } from "./dto/crm-activity.dto";
import { CrmFollowUpDto } from "./dto/crm-followup.dto";
import { CrmConvertSaleDto } from "./dto/crm-convert-sale.dto";
import { CrmMergeDto } from "./dto/crm-merge.dto";
import { CrmNoteDto } from "./dto/crm-note.dto";

@Controller("crm")
export class CrmController {
  constructor(private readonly service: CrmService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @Get("dashboard")
  dashboard() {
    return this.service.dashboard();
  }

  @Get("pipeline")
  pipeline() {
    return this.service.pipeline();
  }

  @Get("segments")
  segments() {
    return this.service.segments();
  }

  @Get("duplicates")
  duplicates() {
    return this.service.duplicates();
  }

  @Get("data-quality")
  dataQuality() {
    return this.service.dataQuality();
  }

  @Get("automation-queue")
  automationQueue() {
    return this.service.automationQueue();
  }

  @Get("forecast")
  forecast() {
    return this.service.forecast();
  }

  @Get("follow-ups/overdue")
  overdueFollowUps() {
    return this.service.overdueFollowUps();
  }

  @Get("export")
  exportRows(@Query() query: any) {
    return this.service.exportRows(query);
  }

  @Post("import")
  importRows(@Body("rows") rows: any[]) {
    return this.service.importRows(rows);
  }

  @Post("bulk/status")
  bulkStatus(@Body() dto: BulkCrmDto) {
    return this.service.bulkStatus(dto);
  }

  @Post("bulk/assign")
  bulkAssign(@Body() dto: BulkCrmDto) {
    return this.service.bulkAssign(dto);
  }

  @Post("merge")
  merge(@Body() dto: CrmMergeDto) {
    return this.service.merge(dto);
  }

  @Get(":id/customer-360")
  customer360(@Param("id") id: string) {
    return this.service.customer360(id);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateCrmDto) {
    return this.service.create(dto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateCrmDto) {
    return this.service.update(id, dto);
  }

  @Post(":id/status")
  changeStatus(@Param("id") id: string, @Body("status") status: string) {
    return this.service.changeStatus(id, status);
  }

  @Post(":id/assign")
  assign(@Param("id") id: string, @Body("assignedToId") assignedToId: string) {
    return this.service.assign(id, assignedToId);
  }

  @Post(":id/follow-up")
  scheduleFollowUp(@Param("id") id: string, @Body() dto: CrmFollowUpDto) {
    return this.service.scheduleFollowUp(id, dto.nextFollowUpAt);
  }

  @Post(":id/activity")
  addActivity(@Param("id") id: string, @Body() dto: CrmActivityDto) {
    return this.service.addActivity(id, dto);
  }

  @Post(":id/note")
  addNote(@Param("id") id: string, @Body() dto: CrmNoteDto) {
    return this.service.addNote(id, dto.note);
  }

  @Post(":id/convert-to-sale")
  convertToSale(@Param("id") id: string, @Body() dto: CrmConvertSaleDto) {
    return this.service.convertToSale(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
