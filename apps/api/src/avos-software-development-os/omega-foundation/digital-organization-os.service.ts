import { Injectable } from '@nestjs/common';
import { OmegaAiTeam } from './omega-foundation.types';

@Injectable()
export class DigitalOrganizationOsService {
  private readonly teams: OmegaAiTeam[] = [
    {
      id: 'team-architecture',
      name: 'Architecture Intelligence Team',
      specialty: 'software-architecture',
      responsibilities: ['architecture review', 'dependency analysis', 'impact analysis', 'drift detection'],
      active: true,
    },
    {
      id: 'team-backend',
      name: 'Backend Engineering Team',
      specialty: 'nestjs-and-services',
      responsibilities: ['modules', 'services', 'controllers', 'contracts'],
      active: true,
    },
    {
      id: 'team-quality',
      name: 'Quality and Verification Team',
      specialty: 'quality-assurance',
      responsibilities: ['verification', 'testing', 'production readiness', 'certification evidence'],
      active: true,
    },
    {
      id: 'team-security',
      name: 'Security and Compliance Team',
      specialty: 'security-and-compliance',
      responsibilities: ['security review', 'privacy review', 'auditability', 'compliance readiness'],
      active: true,
    },
    {
      id: 'team-evolution',
      name: 'Evolution Intelligence Team',
      specialty: 'continuous-improvement',
      responsibilities: ['technical debt', 'modernization', 'roadmap evolution', 'optimization'],
      active: true,
    },
  ];

  listTeams(): OmegaAiTeam[] {
    return structuredClone(this.teams);
  }

  getOrganization() {
    return {
      name: 'AVOS Digital Software Organization',
      operatingSystem: 'Omega Foundation',
      collaborationModel: 'specialized-ai-teams-with-human-final-authority',
      teamCount: this.teams.length,
      teams: this.listTeams(),
    };
  }
}