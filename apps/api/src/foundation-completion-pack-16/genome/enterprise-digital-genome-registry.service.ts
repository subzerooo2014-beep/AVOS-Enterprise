import { createHash } from "crypto";
import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  EnterpriseDigitalGenome,
  GenomeLayer,
  GenomeLayerComposition,
  GenomeStatus
} from "../foundation-pack-16.types";
import { GenomeAuditService } from "../observability/genome-audit.service";

@Injectable()
export class EnterpriseDigitalGenomeRegistryService {
  private readonly genomes =
    new Map<string, EnterpriseDigitalGenome>();

  constructor(
    private readonly audit: GenomeAuditService
  ) {}

  list() {
    return Array.from(this.genomes.values());
  }

  get(id: string) {
    const genome = this.genomes.get(id);

    if (!genome) {
      throw new NotFoundException(
        `Enterprise digital genome not found: ${id}`
      );
    }

    return genome;
  }

  register(input: {
    id?: string;
    name: string;
    description: string;
    version: string;
    status?: GenomeStatus;
    organizationIdentityId: string;
    layers?: GenomeLayerComposition[];
    crossLayerRelations?: EnterpriseDigitalGenome["crossLayerRelations"];
    metadata?: Record<string, unknown>;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const now = new Date().toISOString();

    const draft: Omit<EnterpriseDigitalGenome, "checksum"> = {
      id:
        input.id ??
        `enterprise-genome:${this.slug(input.name)}`,
      name: input.name.trim(),
      description: input.description.trim(),
      version: input.version,
      status: input.status ?? "draft",
      organizationIdentityId:
        input.organizationIdentityId,
      layers: this.normalizeLayers(
        input.layers ?? this.emptyLayers()
      ),
      crossLayerRelations:
        input.crossLayerRelations ?? [],
      metadata: input.metadata ?? {},
      createdAt: now,
      updatedAt: now
    };

    const genome: EnterpriseDigitalGenome = {
      ...draft,
      checksum: this.checksum(draft)
    };

    this.genomes.set(genome.id, genome);

    this.audit.record({
      correlationId: input.correlationId,
      category: "genome",
      action: "enterprise-genome-registered",
      subjectId: genome.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        version: genome.version,
        layers: genome.layers.length
      }
    });

    return genome;
  }

  update(
    id: string,
    patch: {
      description?: string;
      version?: string;
      status?: GenomeStatus;
      layers?: GenomeLayerComposition[];
      crossLayerRelations?: EnterpriseDigitalGenome["crossLayerRelations"];
      metadata?: Record<string, unknown>;
    },
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    const current = this.get(id);

    const draft: Omit<EnterpriseDigitalGenome, "checksum"> = {
      ...current,
      ...patch,
      layers:
        patch.layers === undefined
          ? current.layers
          : this.normalizeLayers(patch.layers),
      crossLayerRelations:
        patch.crossLayerRelations === undefined
          ? current.crossLayerRelations
          : patch.crossLayerRelations,
      metadata: {
        ...current.metadata,
        ...(patch.metadata ?? {})
      },
      updatedAt: new Date().toISOString()
    };

    const updated: EnterpriseDigitalGenome = {
      ...draft,
      checksum: this.checksum(draft)
    };

    this.genomes.set(id, updated);

    this.audit.record({
      correlationId: context.correlationId,
      category: "genome",
      action: "enterprise-genome-updated",
      subjectId: id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        previousVersion: current.version,
        nextVersion: updated.version
      }
    });

    return updated;
  }

  addDnaReference(
    genomeId: string,
    layer: GenomeLayer,
    reference: GenomeLayerComposition["dnaReferences"][number],
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    const genome = this.get(genomeId);

    const layers = genome.layers.map((item) => {
      if (item.layer !== layer) {
        return item;
      }

      const references = item.dnaReferences.filter(
        (candidate) => candidate.dnaId !== reference.dnaId
      );

      references.push(reference);

      return {
        ...item,
        dnaReferences: references,
        completenessScore: this.layerCompleteness(references),
        healthScore: this.layerHealth(references)
      };
    });

    return this.update(
      genomeId,
      { layers },
      context
    );
  }

  summary() {
    const genomes = this.list();

    return {
      total: genomes.length,
      active: genomes.filter(
        (genome) => genome.status === "active"
      ).length,
      totalDnaReferences: genomes.reduce(
        (sum, genome) =>
          sum +
          genome.layers.reduce(
            (layerSum, layer) =>
              layerSum + layer.dnaReferences.length,
            0
          ),
        0
      ),
      totalCrossLayerRelations: genomes.reduce(
        (sum, genome) =>
          sum + genome.crossLayerRelations.length,
        0
      )
    };
  }

  recalculateChecksum(id: string) {
    const current = this.get(id);
    const {
      checksum,
      ...withoutChecksum
    } = current;

    const updated: EnterpriseDigitalGenome = {
      ...withoutChecksum,
      checksum: this.checksum(withoutChecksum)
    };

    this.genomes.set(id, updated);
    return updated;
  }

  private normalizeLayers(
    layers: GenomeLayerComposition[]
  ) {
    const map = new Map<GenomeLayer, GenomeLayerComposition>();

    for (const layer of layers) {
      map.set(layer.layer, {
        ...layer,
        dnaReferences: layer.dnaReferences.filter(
          (reference, index, array) =>
            array.findIndex(
              (candidate) =>
                candidate.dnaId === reference.dnaId
            ) === index
        ),
        weight: Math.max(
          0,
          Math.min(100, layer.weight)
        )
      });
    }

    for (const layer of this.layerNames()) {
      if (!map.has(layer)) {
        map.set(layer, {
          layer,
          dnaReferences: [],
          weight: 0,
          completenessScore: 0,
          healthScore: 0
        });
      }
    }

    return Array.from(map.values());
  }

  private emptyLayers(): GenomeLayerComposition[] {
    return this.layerNames().map((layer) => ({
      layer,
      dnaReferences: [],
      weight: 0,
      completenessScore: 0,
      healthScore: 0
    }));
  }

  private layerNames(): GenomeLayer[] {
    return [
      "architecture",
      "capabilities",
      "security",
      "governance",
      "ai",
      "integrations",
      "products",
      "ecosystem",
      "evolution"
    ];
  }

  private layerCompleteness(
    references: GenomeLayerComposition["dnaReferences"]
  ) {
    if (references.length === 0) {
      return 0;
    }

    return Number(
      (
        references.filter(
          (reference) =>
            reference.identityId.trim().length > 0 &&
            reference.ownerIdentityId.trim().length > 0 &&
            reference.version.trim().length > 0
        ).length /
        references.length *
        100
      ).toFixed(2)
    );
  }

  private layerHealth(
    references: GenomeLayerComposition["dnaReferences"]
  ) {
    if (references.length === 0) {
      return 0;
    }

    return Number(
      (
        references.filter(
          (reference) =>
            reference.status === "active"
        ).length /
        references.length *
        100
      ).toFixed(2)
    );
  }

  private checksum(value: unknown) {
    return createHash("sha256")
      .update(JSON.stringify(value))
      .digest("hex");
  }

  private slug(value: string) {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
}
