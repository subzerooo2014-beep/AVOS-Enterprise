import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AccessDecisionService } from "./access-decision.service";
import { EnterpriseSecurityGovernanceControlPlaneService } from "./enterprise-security-governance-control-plane.service";
import { SecretVaultService } from "./secret-vault.service";
import { SecurityCatalogService } from "./security-catalog.service";
import { SecurityIncidentService } from "./security-incident.service";
import { SecurityPolicyRegistryService } from "./security-policy-registry.service";
import type {
  AccessDecisionRequest,
  SecurityIncidentRecord,
  SecurityPolicyRecord,
} from "./enterprise-security-governance-control-plane.types";

@Controller("enterprise-security-governance-control-plane")
export class EnterpriseSecurityGovernanceControlPlaneController {
  constructor(
    private readonly controlPlane: EnterpriseSecurityGovernanceControlPlaneService,
    private readonly catalog: SecurityCatalogService,
    private readonly policies: SecurityPolicyRegistryService,
    private readonly decisions: AccessDecisionService,
    private readonly incidents: SecurityIncidentService,
    private readonly secrets: SecretVaultService,
  ) {}

  @Get("status")
  status() {
    return this.controlPlane.health();
  }

  @Get("diagnostics")
  diagnostics() {
    return this.controlPlane.diagnostics();
  }

  @Post("catalog/refresh")
  refreshCatalog() {
    const items = this.catalog.refresh();
    return { success: true, discovered: items.length, items };
  }

  @Post("policies")
  registerPolicy(@Body() body: SecurityPolicyRecord) {
    return { success: true, policy: this.policies.register(body) };
  }

  @Post("access/decide")
  decide(@Body() body: AccessDecisionRequest) {
    return { success: true, decision: this.decisions.decide(body) };
  }

  @Get("access/decisions")
  decisionList() {
    return { success: true, items: this.decisions.list() };
  }

  @Post("incidents")
  reportIncident(
    @Body()
    body: Omit<SecurityIncidentRecord, "id" | "status" | "createdAt">,
  ) {
    return { success: true, incident: this.incidents.report(body) };
  }

  @Post("incidents/:id/resolve")
  resolveIncident(@Param("id") id: string) {
    return { success: true, incident: this.incidents.resolve(id) };
  }

  @Post("secrets/:key")
  setSecret(@Param("key") key: string, @Body() body: { value: string }) {
    return { success: true, secret: this.secrets.set(key, body.value) };
  }

  @Get("secrets")
  secretMetadata() {
    return { success: true, items: this.secrets.listMetadata() };
  }
}
