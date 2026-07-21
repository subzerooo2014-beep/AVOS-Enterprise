import { Injectable } from '@nestjs/common';
import {
  SoftwareBlueprint,
  WorkItem,
} from './avos-software-development-os.types';

@Injectable()
export class DigitalOrganizationService {
  createWorkforcePlan(blueprint: SoftwareBlueprint): WorkItem[] {
    const teams: WorkItem['team'][] = [
      'architecture',
      'backend',
      'frontend',
      'mobile',
      'data',
      'ai',
      'security',
      'quality',
      'devops',
      'documentation',
      'compliance',
    ];

    return teams.map((team, index) => ({
      id: `work-${String(index + 1).padStart(2, '0')}-${Date.now()}`,
      team,
      title: `${team} delivery`,
      description: `Deliver the ${team} responsibilities for ${blueprint.projectName}.`,
      dependencies: index === 0 ? [] : [teams[index - 1]],
      state: 'planned',
    }));
  }

  organizationMap() {
    return {
      coordinator: 'AVOS Organization OS',
      authority: 'Human Final Authority',
      sharedSystems: [
        'Living Vision',
        'Living Blueprint',
        'Knowledge Fabric',
        'Capability Fabric',
        'Intelligence Fabric',
        'Digital DNA',
      ],
      teams: [
        'Architecture',
        'Backend',
        'Frontend',
        'Mobile',
        'Data',
        'AI',
        'Security',
        'Quality',
        'DevOps',
        'Documentation',
        'Compliance',
      ],
    };
  }
}