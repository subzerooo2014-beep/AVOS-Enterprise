import { Body, Controller, Get, Post } from "@nestjs/common";
import { EnterprisePlatformRuntimeService } from "./enterprise-platform-runtime.service";
import { WorkflowOrchestratorRuntime } from "./runtime/workflow-orchestrator.runtime";
import { EventMeshRuntime } from "./runtime/event-mesh.runtime";
import { QueueRuntime } from "./runtime/queue.runtime";
import { SchedulerRuntime } from "./runtime/scheduler.runtime";
import { RealtimeGatewayRuntime } from "./runtime/realtime-gateway.runtime";
import { ApiGatewayRuntime } from "./runtime/api-gateway.runtime";
import { ServiceDiscoveryRuntime } from "./runtime/service-discovery.runtime";
import { DisasterRecoveryRuntime } from "./runtime/disaster-recovery.runtime";
import { OperationsDashboardService } from "./services/operations-dashboard.service";
import { HealthCenterService } from "./services/health-center.service";
import { RuntimeMetricsService } from "./services/metrics.service";

@Controller("enterprise-platform-runtime")
export class EnterprisePlatformRuntimeController {
 constructor(
  private readonly os:EnterprisePlatformRuntimeService,private readonly orchestrator:WorkflowOrchestratorRuntime,
  private readonly eventMesh:EventMeshRuntime,private readonly queue:QueueRuntime,private readonly scheduler:SchedulerRuntime,
  private readonly realtime:RealtimeGatewayRuntime,private readonly gateway:ApiGatewayRuntime,
  private readonly discovery:ServiceDiscoveryRuntime,private readonly dr:DisasterRecoveryRuntime,
  private readonly dashboard:OperationsDashboardService,private readonly healthCenter:HealthCenterService,
  private readonly metrics:RuntimeMetricsService
 ){}
 @Get("health") health(){return this.healthCenter.status();}
 @Post("workflows") workflow(@Body() b:any){return {success:true,workflow:this.os.workflows.create(b)};}
 @Post("workflow-executions") execute(@Body() b:any){return {success:true,result:this.orchestrator.execute(b.steps??[],b.input??{})};}
 @Post("events") publish(@Body() b:any){return {success:true,event:this.eventMesh.publish(b.topic,b.payload)};}
 @Post("jobs") job(@Body() b:any){return {success:true,job:this.os.jobs.create(b)};}
 @Post("queue") enqueue(@Body() b:any){return {success:true,item:this.queue.enqueue(b)};}
 @Post("schedules") schedule(@Body() b:any){return {success:true,schedule:this.scheduler.schedule(b.jobId,b.scheduledAt)};}
 @Post("tenants") tenant(@Body() b:any){return {success:true,tenant:this.os.tenants.create(b)};}
 @Post("feature-flags") flag(@Body() b:any){return {success:true,flag:this.os.flags.set(b.key,b.enabled)};}
 @Post("secrets") secret(@Body() b:any){return {success:true,secret:this.os.secrets.set(b.key,b.value)};}
 @Post("config") config(@Body() b:any){return {success:true,config:this.os.config.set(b.key,b.value)};}
 @Post("cache") cache(@Body() b:any){return {success:true,cache:this.os.cache.set(b.key,b.value)};}
 @Post("notifications") notification(@Body() b:any){return {success:true,notification:this.os.notifications.create(b)};}
 @Post("audit") audit(@Body() b:any){return {success:true,audit:this.os.audit.record(b)};}
 @Post("backups") backup(@Body() b:any){return {success:true,backup:this.os.backups.create(b)};}
 @Post("realtime") realtimeBroadcast(@Body() b:any){return this.realtime.broadcast(b.channel,b.payload);}
 @Post("api-routes") apiRoute(@Body() b:any){return this.gateway.route(b.path,b.target);}
 @Post("services") service(@Body() b:any){return this.discovery.register(b.name,b.baseUrl);}
 @Post("disaster-recovery") disasterRecovery(@Body() b:any){return this.dr.plan(b.name,b.rpoMinutes,b.rtoMinutes);}
 @Post("metrics") metric(@Body() b:any){return this.metrics.record(b);}
 @Get("operations/dashboard") operations(){return {success:true,dashboard:this.dashboard.summary()};}
}
