import { Injectable } from '@nestjs/common';
import * as path from 'path';
import {
  PackageGeneratorExecutionResult,
  PackageGeneratorRequest,
} from '../contracts/package-generator.contracts';
import { PackageGeneratorBuildPipelineService } from '../execution/package-generator-build-pipeline.service';
import { PackageGeneratorFilesystemService } from '../filesystem/package-generator-filesystem.service';
import { NestModuleRegistrationService } from '../registration/nest-module-registration.service';
import { PackageGeneratorRegistryService } from '../registry/package-generator-registry.service';
import { PackageGeneratorRollbackService } from '../rollback/package-generator-rollback.service';
import { PackageGeneratorInputValidatorService } from '../validation/package-generator-input-validator.service';
import { TypescriptSourceValidatorService } from '../validation/typescript-source-validator.service';

@Injectable()
export class PackageGeneratorEngineService {
  constructor(
    private readonly inputValidator: PackageGeneratorInputValidatorService,
    private readonly sourceValidator: TypescriptSourceValidatorService,
    private readonly filesystem: PackageGeneratorFilesystemService,
    private readonly rollback: PackageGeneratorRollbackService,
    private readonly registration: NestModuleRegistrationService,
    private readonly buildPipeline: PackageGeneratorBuildPipelineService,
    private readonly registry: PackageGeneratorRegistryService,
  ) {}

  async generate(request: PackageGeneratorRequest): Promise<PackageGeneratorExecutionResult> {
    const inputValidation = this.inputValidator.validate(request);
    const sourceIssues = this.sourceValidator.validate(request.files ?? []);
    const validation = {
      valid:
        inputValidation.valid &&
        sourceIssues.every((issue) => issue.severity !== 'error'),
      score: Math.max(
        0,
        inputValidation.score -
          sourceIssues.filter((issue) => issue.severity === 'error').length * 20,
      ),
      issues: [...inputValidation.issues, ...sourceIssues],
      checkedAt: new Date().toISOString(),
    };

    if (!validation.valid) {
      throw new Error(`Package generator validation failed: ${JSON.stringify(validation.issues)}`);
    }

    const targetRoot = path.resolve(request.targetRoot);
    const apiRoot = this.findApiRoot(targetRoot);
    const rollbackPath =
      request.createRollback === false
        ? undefined
        : await this.rollback.create(targetRoot, request.packageId);

    const generatedFiles = await this.filesystem.writeFiles(targetRoot, request.files);
    const registeredModules = await this.registration.register(request.registrations);

    let typeCheckPassed = false;
    let buildPassed = false;

    if (request.runTypeCheck !== false) {
      typeCheckPassed = await this.buildPipeline.typeCheck(apiRoot);
    }

    if (request.runBuild !== false) {
      buildPassed = await this.buildPipeline.build(apiRoot);
    }

    const result: PackageGeneratorExecutionResult = {
      id: `package-generator-${Date.now()}`,
      packageId: request.packageId,
      packageName: request.packageName,
      packageVersion: request.packageVersion,
      status: 'generated',
      targetRoot,
      generatedFiles,
      rollbackPath,
      validation,
      typeCheckPassed,
      buildPassed,
      registeredModules,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
      executedAt: new Date().toISOString(),
    };

    this.registry.register(result);
    return result;
  }

  private findApiRoot(targetRoot: string): string {
    const normalized = path.resolve(targetRoot);
    const marker = `${path.sep}apps${path.sep}api${path.sep}`;
    const index = normalized.indexOf(marker);
    if (index < 0) {
      throw new Error(`Target root must be inside apps/api: ${targetRoot}`);
    }
    return normalized.substring(0, index + marker.length - 1);
  }
}
