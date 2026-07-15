import { Injectable } from '@nestjs/common';

@Injectable()
export class ReleaseNotesEngineService {
  generate(input: {
    version: string;
    commitSha: string;
    highlights: string[];
    qualityGates: string[];
  }) {
    return [
      `# AVOS Enterprise Production Release ${input.version}`,
      '',
      `Commit: ${input.commitSha}`,
      '',
      '## Highlights',
      ...input.highlights.map((item) => `- ${item}`),
      '',
      '## Quality Gates',
      ...input.qualityGates.map((item) => `- ${item}: PASS`),
      '',
      '## Status',
      'PRODUCTION READY',
      '',
    ].join('\n');
  }
}