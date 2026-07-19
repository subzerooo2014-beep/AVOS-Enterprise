import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { EnterpriseMetadataPlatformService } from "./enterprise-metadata-platform.service";
import { DataFoundationService } from "./data-foundation.service";
import { EnterpriseContractLayerService } from "./enterprise-contract-layer.service";
import { FoundationUltraPackBStatusService } from "./foundation-ultra-pack-b-status.service";
import { FoundationUltraPackBAssuranceService } from "./foundation-ultra-pack-b-assurance.service";

@Controller("avos/foundation/ultra-pack-b")
export class FoundationUltraPackBController {
  constructor(
    private readonly metadata: EnterpriseMetadataPlatformService,
    private readonly data: DataFoundationService,
    private readonly contracts: EnterpriseContractLayerService,
    private readonly statusService: FoundationUltraPackBStatusService,
    private readonly assurance: FoundationUltraPackBAssuranceService,
  ) {}

  @Get("status")
  status() {
    return this.statusService.status();
  }

  @Get("metadata")
  metadataRecords() {
    return this.metadata.list();
  }

  @Get("metadata/search")
  searchMetadata(@Query("q") query = "") {
    return this.metadata.search(query);
  }

  @Get("data/assets")
  dataAssets() {
    return this.data.listDataAssets();
  }

  @Get("data/lineage")
  lineage() {
    return this.data.listLineage();
  }

  @Get("data/quality/rules")
  qualityRules() {
    return this.data.listQualityRules();
  }

  @Get("data/quality/results")
  qualityResults() {
    return this.data.listQualityResults();
  }

  @Get("data/master")
  masterData() {
    return this.data.listMasterRecords();
  }

  @Get("data/governance/status")
  dataGovernanceStatus() {
    return this.data.dataGovernanceStatus();
  }

  @Get("contracts")
  contractsList() {
    return this.contracts.list();
  }

  @Get("contracts/compatibility")
  compatibilityResults() {
    return this.contracts.listCompatibilityResults();
  }

  @Post("verification/run")
  verification() {
    return this.assurance.verification();
  }

  @Post("smoke/run")
  smoke() {
    return this.assurance.smoke();
  }

  @Post("certification/certify")
  certify(@Body() body: { approvedBy: string }) {
    return this.assurance.certify(body.approvedBy);
  }

  @Get("certification/status")
  certificationStatus() {
    return this.assurance.certificationStatus();
  }
}