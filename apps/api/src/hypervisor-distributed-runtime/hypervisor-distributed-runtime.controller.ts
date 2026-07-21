import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { HypervisorDistributedRuntimeService } from './hypervisor-distributed-runtime.service';
import {
  RuntimeEvent,
  RuntimeNode,
  RuntimeWorkload,
} from './hypervisor-distributed-runtime.types';

@Controller('avos/hypervisor-distributed-runtime')
export class HypervisorDistributedRuntimeController {
  constructor(
    private readonly runtime: HypervisorDistributedRuntimeService,
  ) {}

  @Get('status')
  status() {
    return this.runtime.getStatus();
  }

  @Get('dashboard')
  dashboard() {
    return this.runtime.getDashboard();
  }

  @Post('heartbeat')
  heartbeat() {
    return this.runtime.heartbeat();
  }

  @Get('nodes')
  nodes() {
    return this.runtime.getNodes();
  }

  @Post('nodes')
  registerNode(@Body() body: Partial<RuntimeNode>) {
    return this.runtime.registerNode(body);
  }

  @Get('workloads')
  workloads() {
    return this.runtime.getWorkloads();
  }

  @Post('workloads')
  deployWorkload(@Body() body: Partial<RuntimeWorkload>) {
    return this.runtime.deployWorkload(body);
  }

  @Post('workloads/:id/scale')
  scaleWorkload(
    @Param('id') id: string,
    @Body() body: { desiredReplicas: number },
  ) {
    return this.runtime.scaleWorkload(id, body.desiredReplicas);
  }

  @Post('workloads/:id/failover')
  failoverWorkload(@Param('id') id: string) {
    return this.runtime.failoverWorkload(id);
  }

  @Post('optimizer/run')
  optimizer() {
    return this.runtime.runOptimization();
  }

  @Post('commands')
  command(@Body() body: { command: string }) {
    return this.runtime.executeCommand(body.command);
  }

  @Get('events')
  events() {
    return this.runtime.getEvents();
  }

  @Post('events')
  publishEvent(
    @Body()
    body: {
      topic: string;
      source: string;
      severity?: RuntimeEvent['severity'];
      payload?: Record<string, unknown>;
    },
  ) {
    return this.runtime.publishEvent(
      body.topic,
      body.source,
      body.severity ?? 'info',
      body.payload ?? {},
    );
  }

  @Get('policies')
  policies() {
    return this.runtime.getPolicies();
  }

  @Get('certification')
  certification() {
    return this.runtime.getCertification();
  }
}