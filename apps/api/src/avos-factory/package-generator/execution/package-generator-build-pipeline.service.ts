import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { PackageGeneratorCommandRunnerService } from './package-generator-command-runner.service';

@Injectable()
export class PackageGeneratorBuildPipelineService {
  constructor(private readonly runner: PackageGeneratorCommandRunnerService) {}

  async typeCheck(apiRoot: string): Promise<boolean> {
    const result = await this.runner.run('pnpm', ['exec', 'tsc', '--noEmit'], path.resolve(apiRoot));
    if (result.exitCode !== 0) {
      throw new Error(`TypeScript verification failed.\n${result.stdout}\n${result.stderr}`);
    }
    return true;
  }

  async build(apiRoot: string): Promise<boolean> {
    const result = await this.runner.run('pnpm', ['build'], path.resolve(apiRoot));
    if (result.exitCode !== 0) {
      throw new Error(`Nest build failed.\n${result.stdout}\n${result.stderr}`);
    }
    return true;
  }
}
