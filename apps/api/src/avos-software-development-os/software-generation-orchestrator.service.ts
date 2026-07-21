import { Injectable } from '@nestjs/common';
import { WorkItem } from './avos-software-development-os.types';

@Injectable()
export class SoftwareGenerationOrchestratorService {
  prepare(workItems: WorkItem[]) {
    return {
      executionOrder: workItems.map((item, index) => ({
        order: index + 1,
        workItemId: item.id,
        team: item.team,
        action: item.title,
      })),
      generators: [
        'nestjs-api-generator',
        'nextjs-web-generator',
        'flutter-mobile-generator',
        'prisma-data-generator',
        'test-generator',
        'documentation-generator',
        'deployment-generator',
      ],
      safeExecution: {
        additiveChangesPreferred: true,
        backupRequired: true,
        rollbackRequired: true,
        destructiveChangesRequireHumanApproval: true,
      },
    };
  }
}