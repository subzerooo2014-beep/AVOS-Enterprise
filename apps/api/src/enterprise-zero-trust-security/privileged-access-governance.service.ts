import { Injectable } from '@nestjs/common';
import { AccessRequest } from './enterprise-zero-trust-security.types';

@Injectable()
export class PrivilegedAccessGovernanceService {
  evaluate(requests: AccessRequest[]) {
    const privileged = requests.map((request) => {
      const hasPrivilegedRole =
        request.identity.roles.includes('privileged-admin');
      const privilegedAction = [
        'delete',
        'impersonate',
        'rotate-key',
        'override-policy',
      ].includes(request.action);

      return {
        requestId: request.id,
        privilegedAction,
        hasPrivilegedRole,
        approved: !privilegedAction || hasPrivilegedRole,
        risk:
          request.identity.sessionRisk +
          request.sensitivity +
          request.device.malwareScore,
      };
    });

    return {
      requests: privileged,
      rejected: privileged
        .filter((item) => !item.approved)
        .map((item) => item.requestId),
      privilegedRisk: Math.round(
        privileged.reduce((sum, item) => sum + item.risk, 0) /
          Math.max(1, privileged.length),
      ),
    };
  }
}