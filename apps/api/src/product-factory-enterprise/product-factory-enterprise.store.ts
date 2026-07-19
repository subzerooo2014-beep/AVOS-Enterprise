import { Injectable } from '@nestjs/common';
import {
  EvolutionProposal,
  EvolutionSignal,
  MarketplaceRecord,
  ProductDigitalTwin,
  ProductRuntimeRecord,
} from './product-factory-enterprise.types';

@Injectable()
export class ProductFactoryEnterpriseStore {
  readonly runtimes = new Map<string, ProductRuntimeRecord>();
  readonly deploymentHistory: ProductRuntimeRecord[] = [];
  readonly signals: EvolutionSignal[] = [];
  readonly proposals: EvolutionProposal[] = [];
  readonly twins = new Map<string, ProductDigitalTwin>();
  readonly marketplace = new Map<string, MarketplaceRecord>();

  runtimeKey(namespace: string, version: string): string {
    return `${namespace}:${version}`;
  }

  latest(namespace: string): ProductRuntimeRecord | undefined {
    return [...this.runtimes.values()]
      .filter((record) => record.namespace === namespace)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
  }
}