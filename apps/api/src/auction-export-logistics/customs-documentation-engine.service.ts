import { Injectable } from '@nestjs/common';
import { CustomsDocument } from './auction-export-logistics.types';

@Injectable()
export class CustomsDocumentationEngineService {
  validate(documents: CustomsDocument[]) {
    const now = Date.now();

    const evaluated = documents.map((document) => ({
      ...document,
      expired:
        Boolean(document.expiresAt) &&
        new Date(document.expiresAt as string).getTime() < now,
    }));

    return {
      documents: evaluated,
      ready: evaluated.every(
        (document) => document.verified && !document.expired,
      ),
      missingOrInvalid: evaluated
        .filter(
          (document) => !document.verified || document.expired,
        )
        .map((document) => document.id),
    };
  }
}