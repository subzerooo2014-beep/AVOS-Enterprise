param(
    [string]$BaseUrl = "http://localhost:3000",
    [string]$ApprovedBy = "human:khalifa",
    [switch]$Commit,
    [switch]$Push
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

function Write-Section {
    param([string]$Title)

    Write-Host ""
    Write-Host ("=" * 110) -ForegroundColor DarkCyan
    Write-Host $Title -ForegroundColor Cyan
    Write-Host ("=" * 110) -ForegroundColor DarkCyan
}

function Resolve-RepoRoot {
    $Cursor = (Get-Location).Path

    while ($true) {
        if (
            (Test-Path (Join-Path $Cursor "apps\api\src\app.module.ts")) -and
            (Test-Path (Join-Path $Cursor "package.json"))
        ) {
            return $Cursor
        }

        $Parent = Split-Path $Cursor -Parent

        if ([string]::IsNullOrWhiteSpace($Parent) -or $Parent -eq $Cursor) {
            throw "AVOS repository root could not be located."
        }

        $Cursor = $Parent
    }
}

function Write-Utf8File {
    param(
        [string]$Path,
        [AllowEmptyString()]
        [string]$Content
    )

    $Directory = Split-Path $Path -Parent

    if (-not (Test-Path $Directory)) {
        New-Item -ItemType Directory -Path $Directory -Force | Out-Null
    }

    Set-Content `
        -Path $Path `
        -Value $Content `
        -Encoding UTF8
}

function Backup-ItemSafe {
    param(
        [string]$Source,
        [string]$BackupRoot,
        [string]$RepoRoot
    )

    if (-not (Test-Path $Source)) {
        return
    }

    $Relative = $Source.Substring($RepoRoot.Length).TrimStart("\")
    $Destination = Join-Path $BackupRoot $Relative
    $Parent = Split-Path $Destination -Parent

    if (-not (Test-Path $Parent)) {
        New-Item -ItemType Directory -Path $Parent -Force | Out-Null
    }

    if ((Get-Item $Source).PSIsContainer) {
        Copy-Item $Source $Destination -Recurse -Force
    }
    else {
        Copy-Item $Source $Destination -Force
    }
}

function Invoke-Native {
    param(
        [string]$Name,
        [scriptblock]$Command
    )

    Write-Host "Running: $Name" -ForegroundColor Gray

    & $Command

    if ($LASTEXITCODE -ne 0) {
        throw "$Name failed with exit code $LASTEXITCODE."
    }
}

$RepoRoot = Resolve-RepoRoot
Set-Location $RepoRoot

if (-not $ApprovedBy.StartsWith("human:")) {
    throw "ApprovedBy must begin with human:."
}

$ApiRoot = Join-Path $RepoRoot "apps\api"
$SrcRoot = Join-Path $ApiRoot "src"

$AppModulePath = Join-Path $SrcRoot "app.module.ts"

$ReasoningRoot = Join-Path `
    $SrcRoot `
    "unified-intelligence-platform\enterprise-reasoning-system"

$ReasoningModulePath = Join-Path `
    $ReasoningRoot `
    "enterprise-reasoning-system.module.ts"

$EvidenceRoot = Join-Path `
    $SrcRoot `
    "avos-real-production-evidence"

$SmokeTestPath = Join-Path `
    $RepoRoot `
    "AVOS-Real-Production-Evidence-Smoke-Test.ps1"

$RollbackScriptPath = Join-Path `
    $RepoRoot `
    "AVOS-Real-Production-Evidence-Rollback.ps1"

$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"

$BackupRoot = Join-Path `
    $RepoRoot `
    ".avos\rollback\real-production-evidence-$Timestamp"

New-Item -ItemType Directory -Path $BackupRoot -Force | Out-Null

Write-Section "AVOS Real Production Deployment & Evidence Mega Pack"

Write-Host "Repository : $RepoRoot"
Write-Host "Backup     : $BackupRoot" -ForegroundColor Yellow

Backup-ItemSafe $AppModulePath $BackupRoot $RepoRoot
Backup-ItemSafe $ReasoningRoot $BackupRoot $RepoRoot
Backup-ItemSafe $EvidenceRoot $BackupRoot $RepoRoot
Backup-ItemSafe $SmokeTestPath $BackupRoot $RepoRoot
Backup-ItemSafe $RollbackScriptPath $BackupRoot $RepoRoot

Write-Section "Repair EnterpriseReasoningSystemModule"

$UnifiedModulePath = Join-Path `
    $SrcRoot `
    "unified-intelligence-platform\unified-intelligence-platform.module.ts"

if (-not (Test-Path $UnifiedModulePath)) {
    throw "Unified Intelligence Platform module is missing."
}

$UnifiedModuleContent = Get-Content $UnifiedModulePath -Raw

if (
    $UnifiedModuleContent -match "enterprise-reasoning-system.module" -and
    -not (Test-Path $ReasoningModulePath)
) {
    Write-Utf8File $ReasoningModulePath @"
import { Module } from '@nestjs/common';

/**
 * AVOS Enterprise Reasoning System compatibility boundary.
 *
 * This restores the module boundary referenced by the Unified Intelligence
 * Platform without introducing duplicated reasoning behavior.
 */
@Module({
  imports: [],
  controllers: [],
  providers: [],
  exports: [],
})
export class EnterpriseReasoningSystemModule {}
"@

    Write-Utf8File (Join-Path $ReasoningRoot "index.ts") @"
export * from './enterprise-reasoning-system.module';
"@

    Write-Host "EnterpriseReasoningSystemModule created." -ForegroundColor Green
}
else {
    Write-Host "EnterpriseReasoningSystemModule is already valid." -ForegroundColor Green
}

Write-Section "Create Real Production Evidence Layer"

Write-Utf8File `
    (Join-Path $EvidenceRoot "real-production-evidence.types.ts") `
@"
export type RealProductionDomain =
  | 'database'
  | 'environment'
  | 'observability'
  | 'backup-recovery'
  | 'security'
  | 'performance'
  | 'integration'
  | 'deployment';

export interface RealProductionEvidenceRecord {
  domain: RealProductionDomain;
  passed: boolean;
  evidence: string[];
  blockers: string[];
  artifacts: string[];
  executedAt: string;
  source: 'real-execution';
}

export interface RealProductionEvidenceManifest {
  runId: string;
  approvedBy: string;
  generatedAt: string;
  source: 'real-execution';
  evidence: RealProductionEvidenceRecord[];
  manifestHash?: string;
}

export interface RealProductionCertification {
  id: string;
  status: 'blocked' | 'certified';
  score: number;
  verifiedDomains: number;
  totalDomains: number;
  failedDomains: RealProductionDomain[];
  manifestHash: string;
  approvedBy?: string;
  certifiedAt?: string;
  humanFinalAuthority: true;
  globalComplianceReadinessGate: true;
}
"@

Write-Utf8File `
    (Join-Path $EvidenceRoot "real-production-evidence.service.ts") `
@"
import { BadRequestException, Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import {
  RealProductionCertification,
  RealProductionDomain,
  RealProductionEvidenceManifest,
} from './real-production-evidence.types';

const REQUIRED_DOMAINS: RealProductionDomain[] = [
  'database',
  'environment',
  'observability',
  'backup-recovery',
  'security',
  'performance',
  'integration',
  'deployment',
];

@Injectable()
export class RealProductionEvidenceService {
  private manifest?: RealProductionEvidenceManifest;
  private certification?: RealProductionCertification;

  importManifest(input: RealProductionEvidenceManifest) {
    if (!input || input.source !== 'real-execution') {
      throw new BadRequestException('Simulated evidence is not accepted.');
    }

    if (!input.approvedBy?.startsWith('human:')) {
      throw new BadRequestException(
        'Human Final Authority approval is mandatory.',
      );
    }

    if (!Array.isArray(input.evidence) || input.evidence.length !== 8) {
      throw new BadRequestException(
        'Exactly eight real evidence domains are required.',
      );
    }

    const domains = new Set(input.evidence.map((item) => item.domain));

    for (const requiredDomain of REQUIRED_DOMAINS) {
      if (!domains.has(requiredDomain)) {
        throw new BadRequestException(
          'Missing real evidence domain: ' + requiredDomain,
        );
      }
    }

    for (const item of input.evidence) {
      if (item.source !== 'real-execution') {
        throw new BadRequestException(
          'Evidence domain ' + item.domain + ' is not real execution evidence.',
        );
      }

      if (item.passed && item.blockers.length > 0) {
        throw new BadRequestException(
          'Evidence domain ' + item.domain + ' cannot pass with blockers.',
        );
      }
    }

    const manifestHash = createHash('sha256')
      .update(JSON.stringify({ ...input, manifestHash: undefined }))
      .digest('hex');

    this.manifest = {
      ...input,
      manifestHash,
    };

    this.certification = undefined;

    return this.manifest;
  }

  status() {
    const evidence = this.manifest?.evidence ?? [];

    const failedDomains = evidence
      .filter((item) => !item.passed || item.blockers.length > 0)
      .map((item) => item.domain);

    const verifiedDomains = evidence.filter(
      (item) => item.passed && item.blockers.length === 0,
    ).length;

    const totalDomains = REQUIRED_DOMAINS.length;
    const score = Math.round(
      (verifiedDomains / totalDomains) * 100,
    );

    return {
      name: 'AVOS Real Production Deployment & Evidence',
      version: 'RPDE-1.0.0',
      status:
        evidence.length === totalDomains &&
        failedDomains.length === 0
          ? 'real-production-ready'
          : 'blocked',
      score,
      verifiedDomains,
      totalDomains,
      failedDomains,
      manifestHash: this.manifest?.manifestHash ?? null,
      certification: this.certification ?? null,
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      realEvidenceRequired: true,
      simulatedEvidenceAccepted: false,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
    };
  }

  certify(approvedBy: string): RealProductionCertification {
    if (!approvedBy?.startsWith('human:')) {
      throw new BadRequestException(
        'Human Final Authority approval is mandatory.',
      );
    }

    if (!this.manifest?.manifestHash) {
      throw new BadRequestException(
        'A real evidence manifest must be imported first.',
      );
    }

    const state = this.status();

    const canCertify =
      state.verifiedDomains === state.totalDomains &&
      state.failedDomains.length === 0;

    this.certification = {
      id: 'real-production-certification-' + Date.now(),
      status: canCertify ? 'certified' : 'blocked',
      score: state.score,
      verifiedDomains: state.verifiedDomains,
      totalDomains: state.totalDomains,
      failedDomains: state.failedDomains,
      manifestHash: this.manifest.manifestHash,
      approvedBy: canCertify ? approvedBy : undefined,
      certifiedAt: canCertify
        ? new Date().toISOString()
        : undefined,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
    };

    return this.certification;
  }
}
"@

Write-Utf8File `
    (Join-Path $EvidenceRoot "real-production-evidence.controller.ts") `
@"
import { Body, Controller, Get, Post } from '@nestjs/common';
import { RealProductionEvidenceService } from './real-production-evidence.service';
import { RealProductionEvidenceManifest } from './real-production-evidence.types';

@Controller('avos/production/real-evidence')
export class RealProductionEvidenceController {
  constructor(
    private readonly evidenceService: RealProductionEvidenceService,
  ) {}

  @Get('status')
  status() {
    return this.evidenceService.status();
  }

  @Post('manifest/import')
  importManifest(
    @Body() manifest: RealProductionEvidenceManifest,
  ) {
    return this.evidenceService.importManifest(manifest);
  }

  @Post('certify')
  certify(
    @Body() body: { approvedBy: string },
  ) {
    return this.evidenceService.certify(body.approvedBy);
  }
}
"@

Write-Utf8File `
    (Join-Path $EvidenceRoot "real-production-evidence.module.ts") `
@"
import { Module } from '@nestjs/common';
import { RealProductionEvidenceController } from './real-production-evidence.controller';
import { RealProductionEvidenceService } from './real-production-evidence.service';

@Module({
  controllers: [
    RealProductionEvidenceController,
  ],
  providers: [
    RealProductionEvidenceService,
  ],
  exports: [
    RealProductionEvidenceService,
  ],
})
export class RealProductionEvidenceModule {}
"@

Write-Utf8File `
    (Join-Path $EvidenceRoot "index.ts") `
@"
export * from './real-production-evidence.types';
export * from './real-production-evidence.service';
export * from './real-production-evidence.controller';
export * from './real-production-evidence.module';
"@

Write-Section "Register RealProductionEvidenceModule"

$AppModuleContent = Get-Content $AppModulePath -Raw

if ($AppModuleContent -notmatch "avos-real-production-evidence") {
    $ImportLine = @"
import { RealProductionEvidenceModule } from './avos-real-production-evidence';
"@

    $AppModuleContent =
        $ImportLine +
        [Environment]::NewLine +
        $AppModuleContent
}

if (
    $AppModuleContent -notmatch
    "(?m)^\s*RealProductionEvidenceModule\s*,"
) {
    $ImportsMatch = [regex]::Match(
        $AppModuleContent,
        "imports\s*:\s*\["
    )

    if (-not $ImportsMatch.Success) {
        throw "Could not locate imports array in app.module.ts."
    }

    $InsertPosition =
        $ImportsMatch.Index +
        $ImportsMatch.Length

    $AppModuleContent = $AppModuleContent.Insert(
        $InsertPosition,
        [Environment]::NewLine +
        "    RealProductionEvidenceModule,"
    )
}

Write-Utf8File $AppModulePath $AppModuleContent

Write-Section "Create Smoke Test"

Write-Utf8File $SmokeTestPath @"
param(
    [string]`$BaseUrl = "http://localhost:3000",
    [string]`$ManifestPath = "",
    [string]`$ApprovedBy = "human:khalifa"
)

`$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

`$RepoRoot = `$PSScriptRoot
Set-Location `$RepoRoot

if ([string]::IsNullOrWhiteSpace(`$ManifestPath)) {
    `$LatestEvidence = Get-ChildItem `
        (Join-Path `$RepoRoot ".avos\production-evidence") `
        -Directory `
        -ErrorAction Stop |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 1

    if (`$null -eq `$LatestEvidence) {
        throw "No production evidence directory was found."
    }

    `$ManifestPath = Join-Path `
        `$LatestEvidence.FullName `
        "manifest.json"
}

if (-not (Test-Path `$ManifestPath)) {
    throw "Manifest does not exist: `$ManifestPath"
}

`$Manifest = Get-Content `$ManifestPath -Raw |
    ConvertFrom-Json

`$Imported = Invoke-RestMethod `
    -Method Post `
    -Uri "`$BaseUrl/avos/production/real-evidence/manifest/import" `
    -ContentType "application/json" `
    -Body (`$Manifest | ConvertTo-Json -Depth 40)

`$Certification = Invoke-RestMethod `
    -Method Post `
    -Uri "`$BaseUrl/avos/production/real-evidence/certify" `
    -ContentType "application/json" `
    -Body (@{
        approvedBy = `$ApprovedBy
    } | ConvertTo-Json)

`$Status = Invoke-RestMethod `
    -Method Get `
    -Uri "`$BaseUrl/avos/production/real-evidence/status"

`$FailedDomains = @()

if (`$null -ne `$Status.PSObject.Properties["failedDomains"]) {
    `$FailedDomains = @(`$Status.failedDomains)
}

Write-Host ""
Write-Host "AVOS Real Production Evidence Smoke Test" `
    -ForegroundColor Cyan

Write-Host "Platform Status      : `$(`$Status.status)"
Write-Host "Readiness Score      : `$(`$Status.score)"
Write-Host "Verified Domains     : `$(`$Status.verifiedDomains)/`$(`$Status.totalDomains)"
Write-Host "Certification Status : `$(`$Certification.status)"
Write-Host "Failed Domains       : `$(`$FailedDomains -join ', ')"
Write-Host "Manifest Hash        : `$(`$Status.manifestHash)"

if (`$Certification.status -ne "certified") {
    exit 2
}

Write-Host "Smoke Test Passed" -ForegroundColor Green
"@

Write-Section "Create Rollback Script"

Write-Utf8File $RollbackScriptPath @"
param(
    [string]`$BackupPath = ""
)

`$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

`$RepoRoot = `$PSScriptRoot

if ([string]::IsNullOrWhiteSpace(`$BackupPath)) {
    `$LatestBackup = Get-ChildItem `
        (Join-Path `$RepoRoot ".avos\rollback") `
        -Directory |
        Where-Object {
            `$_.Name -like "real-production-evidence-*"
        } |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 1

    if (`$null -eq `$LatestBackup) {
        throw "No rollback snapshot was found."
    }

    `$BackupPath = `$LatestBackup.FullName
}

Get-ChildItem `$BackupPath -Recurse -File |
    ForEach-Object {
        `$Relative = `$_.FullName.Substring(
            `$BackupPath.Length
        ).TrimStart("\")

        `$Destination = Join-Path `
            `$RepoRoot `
            `$Relative

        `$Parent = Split-Path `$Destination -Parent

        if (-not (Test-Path `$Parent)) {
            New-Item `
                -ItemType Directory `
                -Path `$Parent `
                -Force |
                Out-Null
        }

        Copy-Item `
            `$_.FullName `
            `$Destination `
            -Force
    }

Write-Host "Rollback completed from: `$BackupPath" `
    -ForegroundColor Green
"@

Write-Section "TypeScript Check"

Push-Location $ApiRoot

try {
    Invoke-Native "TypeScript noEmit" {
        pnpm exec tsc --noEmit
    }

    Write-Section "NestJS Build"

    Invoke-Native "NestJS Build" {
        pnpm build
    }
}
finally {
    Pop-Location
}

if ($Commit -or $Push) {
    Write-Section "Git Finalization"

    git add -- `
        "apps/api/src/unified-intelligence-platform/enterprise-reasoning-system" `
        "apps/api/src/avos-real-production-evidence" `
        "apps/api/src/app.module.ts" `
        "AVOS-Real-Production-Evidence-Smoke-Test.ps1" `
        "AVOS-Real-Production-Evidence-Rollback.ps1" `
        "AVOS-Real-Production-Deployment-Evidence-Mega-Pack.ps1"

    if ($Commit) {
        $Status = git status --short

        if (
            -not [string]::IsNullOrWhiteSpace(
                ($Status -join [Environment]::NewLine)
            )
        ) {
            Invoke-Native "Git Commit" {
                git commit -m "feat(production): add real deployment evidence platform"
            }
        }
        else {
            Write-Host "No new Git changes detected." `
                -ForegroundColor Yellow
        }
    }

    if ($Push) {
        Invoke-Native "Git Push" {
            git push
        }
    }
}

Write-Section "Mega Pack Completed"

Write-Host "Module          : apps/api/src/avos-real-production-evidence" `
    -ForegroundColor Green

Write-Host "Reasoning Fix   : apps/api/src/unified-intelligence-platform/enterprise-reasoning-system" `
    -ForegroundColor Green

Write-Host "Smoke Test      : AVOS-Real-Production-Evidence-Smoke-Test.ps1" `
    -ForegroundColor Green

Write-Host "Rollback Script : AVOS-Real-Production-Evidence-Rollback.ps1" `
    -ForegroundColor Yellow

Write-Host "Rollback Backup : $BackupRoot" `
    -ForegroundColor Yellow

Write-Host ""
Write-Host "TypeScript      : passed" -ForegroundColor Green
Write-Host "Build           : passed" -ForegroundColor Green
Write-Host ""
Write-Host "Restart the API server, then execute the smoke test." `
    -ForegroundColor Cyan


