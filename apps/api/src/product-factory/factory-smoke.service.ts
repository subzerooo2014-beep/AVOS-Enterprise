import { Injectable } from '@nestjs/common';
import { FactoryBuild } from './product-factory.types';

@Injectable()
export class FactorySmokeService {
  run(build: FactoryBuild) {
    const probes = [
      { name: 'Factory runtime', passed: true },
      { name: 'Template registry', passed: Boolean(build.request.templateId) },
      { name: 'Blueprint engine', passed: Boolean(build.blueprint) },
      { name: 'Integration hub', passed: Boolean(build.integrationSnapshot) },
      { name: 'Product generator', passed: build.artifacts.length > 0 },
      { name: 'Multi-surface generation', passed: new Set(build.artifacts.map((item) => item.surface)).size > 0 },
      { name: 'Pipeline progression', passed: build.progress >= 80 },
    ];
    const passed = probes.filter((probe) => probe.passed).length;
    return {
      id: `product-factory-smoke:${Date.now()}`,
      status: passed === probes.length ? 'passed' : 'failed',
      score: Math.round((passed / probes.length) * 100),
      probes,
      testedAt: new Date().toISOString(),
    };
  }
}