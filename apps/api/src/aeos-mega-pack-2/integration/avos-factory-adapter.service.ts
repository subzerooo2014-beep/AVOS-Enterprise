import { Injectable } from '@nestjs/common';

@Injectable()
export class AvosFactoryAdapterService {
  readonly target = 'AVOS Factory';

  health(): Record<string, unknown> {
    return {
      target: this.target,
      status: 'adapter-ready',
      mode: 'non-invasive',
      required: false,
      boundaryPreserved: true,
      checkedAt: new Date().toISOString(),
    };
  }
}
