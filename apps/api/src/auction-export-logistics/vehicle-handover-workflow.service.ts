import { Injectable } from '@nestjs/common';
import { HandoverRecord } from './auction-export-logistics.types';

@Injectable()
export class VehicleHandoverWorkflowService {
  evaluate(record: HandoverRecord) {
    return {
      ...record,
      accepted:
        record.conditionAccepted &&
        record.documentsAccepted,
      blockers: [
        ...(!record.conditionAccepted
          ? ['vehicle-condition-not-accepted']
          : []),
        ...(!record.documentsAccepted
          ? ['documents-not-accepted']
          : []),
      ],
    };
  }
}