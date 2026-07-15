import { Injectable } from '@nestjs/common';
import { CommerceContract } from './vehicle-finance-commerce.types';

@Injectable()
export class DigitalSignatureCoordinatorService {
  sign(
    contract: CommerceContract,
    signatures: Array<{
      signerId: string;
      role: 'buyer' | 'seller';
      signedAt: string;
    }>,
  ) {
    const buyerSigned = signatures.some(
      (signature) => signature.role === 'buyer',
    );
    const sellerSigned = signatures.some(
      (signature) => signature.role === 'seller',
    );

    return {
      contract: {
        ...contract,
        status:
          buyerSigned && sellerSigned ? 'signed' : contract.status,
      },
      signatures,
      complete: buyerSigned && sellerSigned,
    };
  }
}