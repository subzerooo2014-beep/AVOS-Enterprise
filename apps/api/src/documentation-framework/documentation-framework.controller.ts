import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { DocumentationFrameworkService } from "./documentation-framework.service";
import { CreateDocumentationRecordDto } from "./dto/create-documentation-record.dto";
import { UpdateDocumentationRecordDto } from "./dto/update-documentation-record.dto";

@Controller("avos/documentation")
export class DocumentationFrameworkController {
  constructor(
    private readonly documentationFramework: DocumentationFrameworkService,
  ) {}

  @Get("status")
  status() {
    return this.documentationFramework.status();
  }

  @Get("documents")
  list() {
    return this.documentationFramework.list();
  }

  @Get("documents/:id")
  findById(@Param("id") id: string) {
    return this.documentationFramework.findById(id);
  }

  @Post("register")
  register(@Body() dto: CreateDocumentationRecordDto) {
    return this.documentationFramework.register(dto);
  }

  @Patch("documents/:id")
  update(
    @Param("id") id: string,
    @Body() dto: UpdateDocumentationRecordDto,
  ) {
    return this.documentationFramework.update(id, dto);
  }

  @Post("validate")
  validate(@Body() dto: CreateDocumentationRecordDto) {
    return this.documentationFramework.validate(dto);
  }

  @Get("search")
  search(@Query("q") query = "") {
    return this.documentationFramework.search(query);
  }

  @Get("metrics")
  metrics() {
    return this.documentationFramework.metrics();
  }

  @Post("verification/run")
  verify() {
    return this.documentationFramework.verify();
  }
}
