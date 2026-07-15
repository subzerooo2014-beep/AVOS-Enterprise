import { Injectable } from '@nestjs/common';
import { SignoffRecord } from './production-certification.types';

@Injectable()
export class ExecutiveApprovalEngineService {
  evaluate(signoffs: SignoffRecord[]) {
    const requiredRoles: SignoffRecord['role'][] = [
      'qa',
      'security',
      'operations',
      'cto',
      'executive',
    ];

    const approvedRoles = requiredRoles.filter((role) =>
      signoffs.some(
        (signoff) => signoff.role === role && signoff.approved,
      ),
    );

    return {
      requiredRoles,
      approvedRoles,
      score: Math.round(
        (approvedRoles.length / requiredRoles.length) * 100,
      ),
      approved: approvedRoles.length === requiredRoles.length,
    };
  }
}