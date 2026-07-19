import { createHash } from 'crypto';
import { FactoryArtifact, ProductSurface } from './product-factory.types';

export abstract class FactoryGeneratorBase {
  protected artifact(
    generator: string,
    type: string,
    surface: ProductSurface,
    relativePath: string,
    content: string,
  ): FactoryArtifact {
    return {
      id: `factory-artifact:${generator}:${Date.now()}:${Math.random().toString(16).slice(2)}`,
      generator,
      type,
      surface,
      relativePath,
      checksum: createHash('sha256').update(content).digest('hex'),
      size: Buffer.byteLength(content, 'utf8'),
      generatedAt: new Date().toISOString(),
    };
  }

  abstract generate(context: Record<string, unknown>): FactoryArtifact[];
}