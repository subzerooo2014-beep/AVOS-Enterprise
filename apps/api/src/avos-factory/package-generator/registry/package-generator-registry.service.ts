import { Injectable } from '@nestjs/common';
import {
  PackageGeneratorExecutionResult,
} from '../contracts/package-generator.contracts';

@Injectable()
export class PackageGeneratorRegistryService {
  private readonly executions = new Map<string, PackageGeneratorExecutionResult>();

  register(result: PackageGeneratorExecutionResult): void {
    this.executions.set(result.id, result);
  }

  get(id: string): PackageGeneratorExecutionResult | undefined {
    return this.executions.get(id);
  }

  latest(): PackageGeneratorExecutionResult | undefined {
    return [...this.executions.values()].sort(
      (a, b) => Date.parse(b.executedAt) - Date.parse(a.executedAt),
    )[0];
  }

  list(): PackageGeneratorExecutionResult[] {
    return [...this.executions.values()];
  }

  health(): Record<string, unknown> {
    return {
      executions: this.executions.size,
      latest: this.latest() ?? null,
      status: 'operational',
      checkedAt: new Date().toISOString(),
    };
  }
}
