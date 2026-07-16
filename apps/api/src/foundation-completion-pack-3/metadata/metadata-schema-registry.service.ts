import { Injectable, NotFoundException } from "@nestjs/common";
import {
  MetadataFieldDefinition,
  MetadataSchemaDefinition
} from "../foundation-pack-3.types";

@Injectable()
export class MetadataSchemaRegistryService {
  private readonly schemas = new Map<string, MetadataSchemaDefinition>([
    [
      "metadata:capability:1.0.0",
      {
        id: "metadata:capability:1.0.0",
        assetType: "capability",
        version: "1.0.0",
        status: "active",
        owners: {
          businessOwner: "AVOS Foundation",
          technicalOwner: "AVOS Platform Engineering",
          governanceOwner: "AVOS Governance OS",
          aiOwner: "AVOS Architecture Intelligence"
        },
        fields: [
          {
            name: "id",
            type: "string",
            required: true,
            description: "Global asset identifier."
          },
          {
            name: "name",
            type: "string",
            required: true
          },
          {
            name: "version",
            type: "string",
            required: true
          },
          {
            name: "ownerIdentityId",
            type: "string",
            required: true
          },
          {
            name: "lifecycleStage",
            type: "string",
            required: true
          },
          {
            name: "trustScore",
            type: "number",
            required: true
          },
          {
            name: "dependencies",
            type: "array",
            required: true
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    [
      "metadata:enterprise-contract:1.0.0",
      {
        id: "metadata:enterprise-contract:1.0.0",
        assetType: "enterprise-contract",
        version: "1.0.0",
        status: "active",
        owners: {
          businessOwner: "AVOS Foundation",
          technicalOwner: "AVOS Platform Engineering",
          governanceOwner: "AVOS Governance OS"
        },
        fields: [
          {
            name: "id",
            type: "string",
            required: true
          },
          {
            name: "name",
            type: "string",
            required: true
          },
          {
            name: "version",
            type: "string",
            required: true
          },
          {
            name: "ownerIdentityId",
            type: "string",
            required: true
          },
          {
            name: "eventsProduced",
            type: "array",
            required: true
          },
          {
            name: "eventsConsumed",
            type: "array",
            required: true
          },
          {
            name: "permissions",
            type: "array",
            required: true
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  ]);

  list() {
    return Array.from(this.schemas.values());
  }

  get(id: string) {
    const schema = this.schemas.get(id);

    if (!schema) {
      throw new NotFoundException(`Metadata schema not found: ${id}`);
    }

    return schema;
  }

  register(
    input: Omit<MetadataSchemaDefinition, "createdAt" | "updatedAt">
  ) {
    const now = new Date().toISOString();

    const schema: MetadataSchemaDefinition = {
      ...input,
      fields: this.normalizeFields(input.fields),
      createdAt: now,
      updatedAt: now
    };

    this.schemas.set(schema.id, schema);
    return schema;
  }

  versions(assetType: string) {
    return this.list()
      .filter((schema) => schema.assetType === assetType)
      .sort((left, right) => left.version.localeCompare(right.version));
  }

  evolution(assetType: string) {
    const versions = this.versions(assetType);

    return {
      assetType,
      totalVersions: versions.length,
      versions: versions.map((schema) => ({
        id: schema.id,
        version: schema.version,
        previousVersion: schema.previousVersion ?? null,
        status: schema.status,
        updatedAt: schema.updatedAt
      }))
    };
  }

  summary() {
    const schemas = this.list();

    return {
      total: schemas.length,
      active: schemas.filter((schema) => schema.status === "active").length,
      assetTypes: Array.from(
        new Set(schemas.map((schema) => schema.assetType))
      )
    };
  }

  private normalizeFields(
    fields: MetadataFieldDefinition[]
  ): MetadataFieldDefinition[] {
    const seen = new Set<string>();

    return fields.filter((field) => {
      const normalizedName = field.name.trim();

      if (!normalizedName || seen.has(normalizedName)) {
        return false;
      }

      seen.add(normalizedName);
      field.name = normalizedName;
      return true;
    });
  }
}
