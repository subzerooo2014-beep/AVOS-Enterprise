import { Injectable } from '@nestjs/common';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

@Injectable()
export class FilesystemWriterService {
  async write(root: string, relativePath: string, content: string): Promise<string> {
    const destination = join(root, relativePath);
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, content, 'utf8');
    return destination;
  }
}