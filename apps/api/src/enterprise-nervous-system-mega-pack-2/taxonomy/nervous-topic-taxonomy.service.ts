import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { NervousTopicTaxonomyNode } from "../enterprise-nervous-system-mega-pack-2.types";
import { NervousRoutingAuditService } from "../observability/nervous-routing-audit.service";

@Injectable()
export class NervousTopicTaxonomyService {
  private readonly nodes =
    new Map<string, NervousTopicTaxonomyNode>();

  constructor(
    private readonly audit: NervousRoutingAuditService
  ) {
    this.seed();
  }

  list() {
    return Array.from(this.nodes.values());
  }

  get(id: string) {
    const node = this.nodes.get(id);

    if (!node) {
      throw new NotFoundException(`Nervous topic taxonomy node not found: ${id}`);
    }

    return node;
  }

  register(
    input: Omit<NervousTopicTaxonomyNode, "createdAt" | "updatedAt" | "childrenIds" | "level">,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    if (this.nodes.has(input.id)) {
      throw new ConflictException(
        `Nervous topic taxonomy node already exists: ${input.id}`
      );
    }

    let level = 0;

    if (input.parentId) {
      const parent = this.get(input.parentId);
      level = parent.level + 1;

      const updatedParent: NervousTopicTaxonomyNode = {
        ...parent,
        childrenIds: Array.from(new Set([
          ...parent.childrenIds,
          input.id
        ])),
        updatedAt: new Date().toISOString()
      };

      this.nodes.set(updatedParent.id, updatedParent);
    }

    const now = new Date().toISOString();

    const node: NervousTopicTaxonomyNode = {
      ...input,
      level,
      childrenIds: [],
      createdAt: now,
      updatedAt: now
    };

    this.nodes.set(node.id, node);

    this.audit.record({
      correlationId: context.correlationId,
      category: "taxonomy",
      action: "nervous-topic-taxonomy-node-registered",
      subjectId: node.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        fullPath: node.fullPath,
        level: node.level
      }
    });

    return node;
  }

  match(topic: string) {
    return this.list()
      .filter((node) => node.active)
      .filter(
        (node) =>
          topic === node.fullPath ||
          topic.startsWith(`${node.fullPath}.`)
      )
      .sort((left, right) => right.level - left.level);
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      active: items.filter((x) => x.active).length,
      roots: items.filter((x) => !x.parentId).length,
      maxDepth:
        items.length === 0
          ? 0
          : Math.max(...items.map((x) => x.level))
    };
  }

  private seed() {
    const now = new Date().toISOString();

    const items: NervousTopicTaxonomyNode[] = [
      {
        id: "taxonomy:avos",
        name: "AVOS",
        fullPath: "avos",
        description: "AVOS root topic namespace.",
        domain: "platform",
        level: 0,
        childrenIds: [
          "taxonomy:avos-system",
          "taxonomy:avos-brain",
          "taxonomy:avos-governance"
        ],
        active: true,
        metadata: { seeded: true },
        createdAt: now,
        updatedAt: now
      },
      {
        id: "taxonomy:avos-system",
        name: "AVOS System",
        fullPath: "avos.system",
        parentId: "taxonomy:avos",
        description: "System-level topics.",
        domain: "system",
        level: 1,
        childrenIds: [],
        active: true,
        metadata: { seeded: true },
        createdAt: now,
        updatedAt: now
      },
      {
        id: "taxonomy:avos-brain",
        name: "AVOS Brain",
        fullPath: "avos.brain",
        parentId: "taxonomy:avos",
        description: "Enterprise Brain topics.",
        domain: "brain",
        level: 1,
        childrenIds: [],
        active: true,
        metadata: { seeded: true },
        createdAt: now,
        updatedAt: now
      },
      {
        id: "taxonomy:avos-governance",
        name: "AVOS Governance",
        fullPath: "avos.governance",
        parentId: "taxonomy:avos",
        description: "Governance topics.",
        domain: "governance",
        level: 1,
        childrenIds: [],
        active: true,
        metadata: { seeded: true },
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const item of items) {
      this.nodes.set(item.id, item);
    }
  }
}
