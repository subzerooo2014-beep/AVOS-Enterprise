import { Injectable } from '@nestjs/common';
import { CommerceContract } from './vehicle-finance-commerce.types';

@Injectable()
export class ContractGenerationEngineService {
  generate(
    input: Omit<CommerceContract, 'status'>,
  ): CommerceContract {
    return {
      ...input,
      status: 'issued',
      terms: [
        ...input.terms,
        'Vehicle condition accepted by buyer',
        'Payment subject to settlement confirmation',
      ],
    };
  }
}