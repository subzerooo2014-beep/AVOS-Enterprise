import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { TransactionLifecycleService } from "./transaction-lifecycle.service";
import {
  TransactionCase,
  TransactionCommand,
  TransactionStatus,
} from "./transaction-lifecycle.types";

@Controller("transaction-lifecycle")
export class TransactionLifecycleController {
  constructor(private readonly lifecycle: TransactionLifecycleService) {}

  @Get("domains")
  domains() {
    return this.lifecycle.domains();
  }

  @Post("cases")
  createCase(
    @Body()
    input: Omit<TransactionCase, "id" | "status" | "createdAt" | "updatedAt">,
  ) {
    return this.lifecycle.createCase(input);
  }

  @Get("cases/:id")
  caseById(@Param("id") id: string) {
    return this.lifecycle.caseById(id);
  }

  @Patch("cases/:id/status")
  updateStatus(
    @Param("id") id: string,
    @Body() body: { status: TransactionStatus },
  ) {
    return this.lifecycle.updateStatus(id, body.status);
  }

  @Get("domains/:key/cases")
  casesForDomain(@Param("key") key: string) {
    return this.lifecycle.casesForDomain(key);
  }

  @Post("execute")
  execute(@Body() command: TransactionCommand) {
    return this.lifecycle.execute(command);
  }

  @Get("dashboard")
  dashboard() {
    return this.lifecycle.dashboard();
  }
}