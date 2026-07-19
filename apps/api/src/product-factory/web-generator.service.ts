import { Injectable } from '@nestjs/common';
import { FactoryGeneratorBase } from './factory-generator-base';
import { FactoryArtifact } from './product-factory.types';

@Injectable()
export class WebGeneratorService extends FactoryGeneratorBase {
  generate(context: Record<string, unknown>): FactoryArtifact[] {
    const payload = JSON.stringify(
      {
        generator: 'WebGeneratorService',
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
        'WebGeneratorService',
        'web-source',
        'web',
        'web/app/page.tsx',
        payload,
      ),
    ];
  }
}