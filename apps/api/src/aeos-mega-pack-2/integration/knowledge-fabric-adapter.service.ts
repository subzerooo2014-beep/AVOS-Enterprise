import { Injectable } from '@nestjs/common';

@Injectable()
export class KnowledgeFabricAdapterService {
  readonly target = 'Knowledge Fabric';

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
