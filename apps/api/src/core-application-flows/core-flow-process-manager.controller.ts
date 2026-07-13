import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CoreFlowProcessManagerService } from "./core-flow-process-manager.service";
import { CoreFlowApprovalService } from "./core-flow-approval.service";

@Controller("core-flow-process-manager")
export class CoreFlowProcessManagerController {
  constructor(
    private readonly processes: CoreFlowProcessManagerService,
    private readonly approvals: CoreFlowApprovalService,
  ) {}

  @Post("definitions")
  registerDefinition(@Body() dto: any) {
    return this.processes.registerDefinition(dto);
  }

  @Get("definitions")
  definitions() {
    return this.processes.definitionsList();
  }

  @Post("definitions/:name/start")
  start(@Param("name") name: string, @Body() dto: any) {
    return this.processes.start(name, dto);
  }

  @Get("executions")
  executions(@Query() query: any) {
    return this.processes.findAllExecutions(query);
  }

  @Get("executions/:id")
  execution(@Param("id") id: string) {
    return this.processes.findExecution(id);
  }

  @Get("executions/:id/ready-nodes")
  readyNodes(@Param("id") id: string) {
    return this.processes.readyNodes(id);
  }

  @Post("executions/:id/nodes/:nodeId/start")
  startNode(@Param("id") id: string, @Param("nodeId") nodeId: string) {
    return this.processes.startNode(id, nodeId);
  }

  @Post("executions/:id/nodes/:nodeId/complete")
  completeNode(
    @Param("id") id: string,
    @Param("nodeId") nodeId: string,
    @Body() dto: any,
  ) {
    return this.processes.completeNode(id, nodeId, dto?.output);
  }

  @Post("executions/:id/nodes/:nodeId/fail")
  failNode(
    @Param("id") id: string,
    @Param("nodeId") nodeId: string,
    @Body() dto: any,
  ) {
    return this.processes.failNode(id, nodeId, dto?.error);
  }

  @Post("executions/:id/nodes/:nodeId/evaluate-rules")
  evaluateRules(
    @Param("id") id: string,
    @Param("nodeId") nodeId: string,
    @Body() dto: any,
  ) {
    return this.processes.applyRule(id, nodeId, dto?.rules ?? []);
  }

  @Post("executions/:id/compensate")
  compensate(@Param("id") id: string, @Body() dto: any) {
    return this.processes.compensate(id, dto?.reason);
  }

  @Post("timeouts/sweep")
  timeoutSweep() {
    return this.processes.timeoutSweep();
  }

  @Get("analytics")
  analytics() {
    return this.processes.analytics();
  }

  @Post("approvals")
  requestApproval(@Body() dto: any) {
    return this.approvals.request(dto?.executionId, dto?.nodeId);
  }

  @Get("approvals")
  approvalsList(@Query() query: any) {
    return this.approvals.findAll(query);
  }

  @Post("approvals/:id/approve")
  approve(@Param("id") id: string, @Body() dto: any) {
    return this.approvals.approve(id, dto?.actor ?? "system", dto?.reason);
  }

  @Post("approvals/:id/reject")
  reject(@Param("id") id: string, @Body() dto: any) {
    return this.approvals.reject(id, dto?.actor ?? "system", dto?.reason);
  }
}
