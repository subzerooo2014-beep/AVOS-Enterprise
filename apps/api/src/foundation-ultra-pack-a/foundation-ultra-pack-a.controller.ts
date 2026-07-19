import { Body, Controller, Get, Post } from "@nestjs/common";
import { DigitalConstitutionService } from "./digital-constitution.service";
import { EnterpriseLanguageService } from "./enterprise-language.service";
import { SemanticEngineService } from "./semantic-engine.service";
import { DigitalIdentityFoundationService } from "./digital-identity-foundation.service";
import { LivingBlueprintService } from "./living-blueprint.service";
import { FoundationUltraPackAStatusService } from "./foundation-ultra-pack-a-status.service";
import { FoundationUltraPackAAssuranceService } from "./foundation-ultra-pack-a-assurance.service";

@Controller("avos/foundation/ultra-pack-a")
export class FoundationUltraPackAController {
  constructor(
    private readonly constitution: DigitalConstitutionService,
    private readonly language: EnterpriseLanguageService,
    private readonly semantic: SemanticEngineService,
    private readonly identity: DigitalIdentityFoundationService,
    private readonly blueprint: LivingBlueprintService,
    private readonly statusService: FoundationUltraPackAStatusService,
    private readonly assurance: FoundationUltraPackAAssuranceService,
  ) {}

  @Get("status")
  status() {
    return this.statusService.status();
  }

  @Get("constitution/rules")
  constitutionRules() {
    return this.constitution.listRules();
  }

  @Post("constitution/validate")
  validateConstitution(@Body() body: Record<string, unknown>) {
    return this.constitution.validate(body);
  }

  @Get("language/terms")
  languageTerms() {
    return this.language.list();
  }

  @Post("semantic/normalize")
  normalize(@Body() body: { text: string }) {
    return this.semantic.normalize(body.text ?? "");
  }

  @Get("identity/assets")
  assets() {
    return this.identity.listAssetIdentities();
  }

  @Get("identity/dna")
  dna() {
    return this.identity.listDna();
  }

  @Get("identity/genomes")
  genomes() {
    return this.identity.listGenomes();
  }

  @Post("identity/genome/snapshot")
  genomeSnapshot(@Body() body: { name?: string }) {
    return this.identity.buildGenomeSnapshot(body?.name);
  }

  @Get("blueprints")
  blueprints() {
    return this.blueprint.list();
  }

  @Get("drifts")
  drifts() {
    return this.blueprint.listDrifts();
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