import { Injectable } from '@nestjs/common';
import { InventoryRecord } from './vehicle-marketplace-operations.types';

@Injectable()
export class VehicleInventoryEngineService {
  evaluate(records: InventoryRecord[]) {
    return {
      records,
      available: records.filter(
        (record) =>
          record.state === 'available' && record.quantity > 0,
      ),
      reserved: records.filter(
        (record) => record.state === 'reserved',
      ),
      sold: records.filter((record) => record.state === 'sold'),
      activeQuantity: records
        .filter((record) => record.state === 'available')
        .reduce((sum, record) => sum + record.quantity, 0),
    };
  }
}