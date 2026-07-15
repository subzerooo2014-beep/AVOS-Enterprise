import { Injectable } from '@nestjs/common';
import { LoyaltyAccount } from './enterprise-crm-growth.types';

@Injectable()
export class LoyaltyRewardsEngineService {
  apply(account: LoyaltyAccount, points: number): LoyaltyAccount {
    const total = Math.max(0, account.points + points);

    return {
      ...account,
      points: total,
      tier:
        total >= 10000
          ? 'platinum'
          : total >= 5000
            ? 'gold'
            : total >= 2000
              ? 'silver'
              : 'basic',
    };
  }
}