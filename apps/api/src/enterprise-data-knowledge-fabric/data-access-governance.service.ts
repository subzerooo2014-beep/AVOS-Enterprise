import { Injectable } from '@nestjs/common';
import {
  DataAccessPolicy,
  DataAsset,
} from './enterprise-data-knowledge-fabric.types';

@Injectable()
export class DataAccessGovernanceService {
  evaluate(
    asset: DataAsset,
    roles: string[],
    policies: DataAccessPolicy[],
  ) {
    const matched = policies.filter(
      (policy) =>
        policy.allowedClassifications.includes(asset.classification) &&
        policy.allowedRegions.includes(asset.region),
    );

    const allowed = matched.some((policy) =>
      policy.requiredRoles.every((role) => roles.includes(role)),
    );

    return {
      assetId: asset.id,
      allowed,
      matchedPolicies: matched.map((policy) => policy.id),
      reasons: [
        ...(matched.length === 0 ? ['no-applicable-policy'] : []),
        ...(!allowed && matched.length > 0
          ? ['required-role-missing']
          : []),
      ],
    };
  }
}