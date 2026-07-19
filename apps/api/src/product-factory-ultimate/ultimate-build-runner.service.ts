import { Injectable } from '@nestjs/common';
import { spawnSync } from 'node:child_process';

export interface UltimateCommandResult {
  command: string;
  exitCode: number;
  stdout: string;
  stderr: string;
  passed: boolean;
}

@Injectable()
export class UltimateBuildRunnerService {
  run(workspace: string): UltimateCommandResult[] {
    const commands = [
      ['pnpm', ['install', '--ignore-workspace', '--frozen-lockfile=false']],
      ['pnpm', ['exec', 'tsc', '--noEmit']],
      ['pnpm', ['exec', 'tsc', '-p', 'tsconfig.json']],
      ['node', ['dist/tests/smoke.js']],
    ] as const;

    return commands.map(([command, args]) => {
      const result = spawnSync(command, [...args], {
        cwd: workspace,
        encoding: 'utf8',
        shell: process.platform === 'win32',
      });
      const exitCode = result.status ?? 1;
      return {
        command: `${command} ${args.join(' ')}`,
        exitCode,
        stdout: result.stdout || '',
        stderr: result.stderr || '',
        passed: exitCode === 0,
      };
    });
  }
}