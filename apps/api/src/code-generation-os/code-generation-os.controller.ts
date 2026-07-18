import { Controller, Get, Post } from "@nestjs/common";
import { CodeGenerationOsService } from "./code-generation-os.service";

@Controller("code-generation-os")
export class CodeGenerationOsController {
  constructor(private readonly service: CodeGenerationOsService) {}

  @Get("status")
  status() {
    return this.service.status();
  }

  @Get("verification")
  verification() {
    return this.service.verification();
  }

  @Post("smoke")
  smoke() {
    return this.service.smoke();
  }
}
