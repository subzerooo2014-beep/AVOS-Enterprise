import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';

export interface CommandExecutionResult {
  command: string;
  args: string[];
  cwd: string;
  exitCode: number;
  stdout: string;
  stderr: string;
}

@Injectable()
export class PackageGeneratorCommandRunnerService {
  run(command: string, args: string[], cwd: string): Promise<CommandExecutionResult> {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        cwd,
        shell: process.platform === 'win32',
        env: process.env,
      });

      let stdout = '';
      let stderr = '';

      child.stdout?.on('data', (chunk: Buffer | string) => {
        stdout += chunk.toString();
      });

      child.stderr?.on('data', (chunk: Buffer | string) => {
        stderr += chunk.toString();
      });

      child.on('error', reject);
      child.on('close', (code) => {
        resolve({
          command,
          args,
          cwd,
          exitCode: code ?? 1,
          stdout,
          stderr,
        });
      });
    });
  }
}
