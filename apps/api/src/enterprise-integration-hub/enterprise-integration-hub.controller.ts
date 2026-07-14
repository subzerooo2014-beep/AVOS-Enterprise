import { Body, Controller, Get, Post } from "@nestjs/common";
import { EnterpriseIntegrationHubService } from "./enterprise-integration-hub.service";
import { ConnectorRegistryService } from "./services/connector-registry.service";
import { IntegrationExecutionService } from "./services/integration-execution.service";
import { IntegrationSchedulerService } from "./services/integration-scheduler.service";
import { IntegrationRetryService } from "./services/integration-retry.service";
import { IntegrationMappingService } from "./services/integration-mapping.service";
import { IntegrationTransformationService } from "./services/integration-transformation.service";
import { IntegrationSecurityService } from "./services/integration-security.service";
import { IntegrationMarketplaceService } from "./services/integration-marketplace.service";
import { ConnectorCertificationService } from "./services/connector-certification.service";
import { ConnectorInstallerService } from "./services/connector-installer.service";
import { IntegrationDashboardService } from "./services/integration-dashboard.service";
import { ErpConnector } from "./connectors/erp.connector";
import { CrmConnector } from "./connectors/crm.connector";
import { BankingConnector } from "./connectors/banking.connector";
import { GovernmentConnector } from "./connectors/government.connector";
import { IotConnector } from "./connectors/iot.connector";
import { MessagingConnector } from "./connectors/messaging.connector";
import { PaymentConnector } from "./connectors/payment.connector";
import { AiProviderConnector } from "./connectors/ai-provider.connector";

@Controller("enterprise-integration-hub")
export class EnterpriseIntegrationHubController {
  constructor(
    private readonly os: EnterpriseIntegrationHubService,
    private readonly registry: ConnectorRegistryService,
    private readonly executions: IntegrationExecutionService,
    private readonly schedules: IntegrationSchedulerService,
    private readonly retries: IntegrationRetryService,
    private readonly mappings: IntegrationMappingService,
    private readonly transformations: IntegrationTransformationService,
    private readonly security: IntegrationSecurityService,
    private readonly marketplace: IntegrationMarketplaceService,
    private readonly certification: ConnectorCertificationService,
    private readonly installer: ConnectorInstallerService,
    private readonly dashboard: IntegrationDashboardService,
    private readonly erp: ErpConnector,
    private readonly crm: CrmConnector,
    private readonly banking: BankingConnector,
    private readonly government: GovernmentConnector,
    private readonly iot: IotConnector,
    private readonly messaging: MessagingConnector,
    private readonly payment: PaymentConnector,
    private readonly aiProvider: AiProviderConnector,
  ) {}

  @Get("health") health(){ return this.os.health(); }
  @Post("connectors") registerConnector(@Body() body:any){ return {success:true,connector:this.registry.create(body)}; }
  @Post("executions") execution(@Body() body:any){ return {success:true,execution:this.executions.create(body)}; }
  @Post("schedules") schedule(@Body() body:any){ return {success:true,schedule:this.schedules.create(body)}; }
  @Post("retries") retry(@Body() body:any){ return {success:true,retry:this.retries.create(body)}; }
  @Post("mappings") mapping(@Body() body:any){ return {success:true,mapping:this.mappings.create(body)}; }
  @Post("transformations") transformation(@Body() body:any){ return {success:true,transformation:this.transformations.create(body)}; }
  @Post("security-profiles") securityProfile(@Body() body:any){ return {success:true,profile:this.security.create(body)}; }
  @Post("marketplace") marketplaceListing(@Body() body:any){ return {success:true,listing:this.marketplace.create(body)}; }
  @Post("certifications") certificationRecord(@Body() body:any){ return {success:true,certification:this.certification.create(body)}; }
  @Post("installations") installation(@Body() body:any){ return {success:true,installation:this.installer.create(body)}; }
  @Post("connectors/erp") erpExecute(@Body() body:any){ return this.erp.execute(body.operation,body.payload??{}); }
  @Post("connectors/crm") crmExecute(@Body() body:any){ return this.crm.execute(body.operation,body.payload??{}); }
  @Post("connectors/banking") bankingExecute(@Body() body:any){ return this.banking.execute(body.operation,body.payload??{}); }
  @Post("connectors/government") governmentExecute(@Body() body:any){ return this.government.execute(body.operation,body.payload??{}); }
  @Post("connectors/iot") iotExecute(@Body() body:any){ return this.iot.execute(body.operation,body.payload??{}); }
  @Post("connectors/messaging") messagingExecute(@Body() body:any){ return this.messaging.execute(body.operation,body.payload??{}); }
  @Post("connectors/payment") paymentExecute(@Body() body:any){ return this.payment.execute(body.operation,body.payload??{}); }
  @Post("connectors/ai-provider") aiProviderExecute(@Body() body:any){ return this.aiProvider.execute(body.operation,body.payload??{}); }
  @Get("operations/dashboard") operations(){ return {success:true,dashboard:this.dashboard.summary()}; }
}
