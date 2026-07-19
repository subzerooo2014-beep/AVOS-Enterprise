import { BadRequestException, Injectable } from '@nestjs/common';
import { FactoryBlueprint, FactoryBuildRequest } from './product-factory.types';

@Injectable()
export class FactoryBlueprintService {
  create(buildId: string, request: FactoryBuildRequest): FactoryBlueprint {
    if (!request.approvedBy?.trim()) {
      throw new BadRequestException('Human Final Authority approval is required.');
    }

    const endpoints = request.entities.flatMap((entity) => {
      const slug = entity
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/\s+/g, '-')
        .toLowerCase();

      return [
        `GET /${request.namespace}/${slug}`,
        `GET /${request.namespace}/${slug}/:id`,
        `POST /${request.namespace}/${slug}`,
        `PATCH /${request.namespace}/${slug}/:id`,
        `DELETE /${request.namespace}/${slug}/:id`,
      ];
    });

    return {
      id: `factory-blueprint:${Date.now()}`,
      buildId,
      productName: request.productName,
      namespace: request.namespace,
      modules: [
        `${request.namespace}-domain`,
        `${request.namespace}-application`,
        `${request.namespace}-infrastructure`,
        `${request.namespace}-interfaces`,
      ],
      entities: request.entities,
      endpoints,
      workflows: request.workflows,
      integrations: request.integrations,
      surfaces: request.surfaces,
      qualityGates: [
        'Foundation First Gate',
        'Capability First Gate',
        'Blueprint Conformance Gate',
        'Human Final Authority Gate',
        'Global Compliance Readiness Gate',
        'TypeScript Gate',
        'Build Gate',
        'Smoke Gate',
        'Certification Gate',
      ],
      governance: {
        foundationFirst: true,
        capabilityFirst: true,
        blueprintDriven: true,
        humanFinalAuthority: true,
        globalComplianceReadinessGate: true,
        approvedBy: request.approvedBy,
      },
      createdAt: new Date().toISOString(),
    };
  }
}