import { Injectable } from '@nestjs/common';
import { FactoryGeneratorBase } from './factory-generator-base';
import { FactoryArtifact } from './product-factory.types';

@Injectable()
export class TestingGeneratorService extends FactoryGeneratorBase {
  generate(context: Record<string, unknown>): FactoryArtifact[] {
    const payload = JSON.stringify(
      {
        generator: 'TestingGeneratorService',
        namespace: String(context['namespace'] ?? 'generated-product'),
        productName: String(context['productName'] ?? 'Generated Product'),
        entities: context['entities'] ?? [],
        capabilities: context['capabilities'] ?? [],
        integrations: context['integrations'] ?? [],
        generatedBy: 'AVOS Product Factory',
      },
      null,
      2,
    );

    return [
      this.artifact(
        'TestingGeneratorService',
        'test',
        'tests',
        'tests/product.smoke.spec.ts',
        payload,
      ),
    ];
  }
}