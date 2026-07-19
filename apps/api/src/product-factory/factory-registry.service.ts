import { Injectable, NotFoundException } from '@nestjs/common';
import { FactoryBuild, FactoryTemplate } from './product-factory.types';

@Injectable()
export class FactoryRegistryService {
  private readonly builds = new Map<string, FactoryBuild>();
  private readonly templates = new Map<string, FactoryTemplate>();

  saveBuild(build: FactoryBuild) {
    this.builds.set(build.id, structuredClone(build));
    return structuredClone(build);
  }

  getBuild(id: string) {
    const build = this.builds.get(id);
    if (!build) throw new NotFoundException(`Factory build not found: ${id}`);
    return structuredClone(build);
  }

  listBuilds() {
    return [...this.builds.values()]
      .map((item) => structuredClone(item))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  saveTemplate(template: FactoryTemplate) {
    this.templates.set(template.id, structuredClone(template));
    return structuredClone(template);
  }

  getTemplate(id: string) {
    const template = this.templates.get(id);
    if (!template) throw new NotFoundException(`Factory template not found: ${id}`);
    return structuredClone(template);
  }

  listTemplates() {
    return [...this.templates.values()].map((item) => structuredClone(item));
  }

  metrics() {
    const builds = this.listBuilds();
    return {
      templates: this.templates.size,
      builds: builds.length,
      completed: builds.filter((item) => item.stage === 'completed').length,
      failed: builds.filter((item) => item.stage === 'failed').length,
      rolledBack: builds.filter((item) => item.stage === 'rolled-back').length,
      artifacts: builds.reduce((sum, item) => sum + item.artifacts.length, 0),
      certified: builds.filter(
        (item) => item.certification?.['status'] === 'certified',
      ).length,
    };
  }
}