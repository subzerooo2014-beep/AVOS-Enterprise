import { Injectable } from '@nestjs/common';

@Injectable()
export class CapabilityFabricAdapterService {
  readonly target = 'Capability Fabric';

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
