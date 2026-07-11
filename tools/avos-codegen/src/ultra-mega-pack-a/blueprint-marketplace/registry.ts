import {
  randomUUID,
} from "node:crypto";
import {
  MarketplaceBlueprint,
  MarketplaceBlueprintStatus,
  MarketplaceInstallation,
  MarketplaceReview,
  MarketplaceSearchQuery,
  MarketplaceSearchResult,
} from "./contracts";

export class EnterpriseBlueprintMarketplaceRegistry {
  private readonly blueprints =
    new Map<string, MarketplaceBlueprint>();

  private readonly reviews:
    MarketplaceReview[] = [];

  private readonly installations:
    MarketplaceInstallation[] = [];

  publish(
    input: Omit<
      MarketplaceBlueprint,
      | "id"
      | "status"
      | "rating"
      | "installCount"
      | "createdAt"
      | "updatedAt"
    >,
  ): MarketplaceBlueprint {
    const duplicate =
      Array.from(
        this.blueprints.values(),
      ).some(
        (item) =>
          item.key === input.key &&
          item.version ===
            input.version,
      );

    if (duplicate) {
      throw new Error(
        `Blueprint already exists: ${input.key}@${input.version}`,
      );
    }

    const now =
      new Date().toISOString();

    const blueprint:
      MarketplaceBlueprint = {
      ...structuredClone(input),
      id: randomUUID(),
      status:
        MarketplaceBlueprintStatus.REVIEW,
      rating: 0,
      installCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    this.blueprints.set(
      blueprint.id,
      blueprint,
    );

    return structuredClone(
      blueprint,
    );
  }

  approve(
    blueprintId: string,
  ): MarketplaceBlueprint {
    const blueprint =
      this.get(blueprintId);

    blueprint.status =
      MarketplaceBlueprintStatus.PUBLISHED;

    blueprint.updatedAt =
      new Date().toISOString();

    this.blueprints.set(
      blueprint.id,
      blueprint,
    );

    return structuredClone(
      blueprint,
    );
  }

  review(
    blueprintId: string,
    reviewer: string,
    rating: number,
    comment: string,
    approved: boolean,
  ): MarketplaceReview {
    const blueprint =
      this.get(blueprintId);

    const review:
      MarketplaceReview = {
      id: randomUUID(),
      blueprintId,
      reviewer,
      rating:
        Math.max(
          1,
          Math.min(5, rating),
        ),
      comment,
      approved,
      createdAt:
        new Date().toISOString(),
    };

    this.reviews.push(review);

    const ratings =
      this.reviews
        .filter(
          (item) =>
            item.blueprintId ===
            blueprintId,
        )
        .map(
          (item) =>
            item.rating,
        );

    blueprint.rating =
      ratings.reduce(
        (total, item) =>
          total + item,
        0,
      ) /
      ratings.length;

    blueprint.updatedAt =
      new Date().toISOString();

    this.blueprints.set(
      blueprint.id,
      blueprint,
    );

    return structuredClone(review);
  }

  install(
    blueprintId: string,
    targetSystem: string,
  ): MarketplaceInstallation {
    const blueprint =
      this.get(blueprintId);

    if (
      blueprint.status !==
      MarketplaceBlueprintStatus.PUBLISHED
    ) {
      throw new Error(
        "Only published blueprints can be installed.",
      );
    }

    const installation:
      MarketplaceInstallation = {
      id: randomUUID(),
      blueprintId:
        blueprint.id,
      targetSystem,
      version:
        blueprint.version,
      installedAt:
        new Date().toISOString(),
    };

    this.installations.push(
      installation,
    );

    blueprint.installCount += 1;
    blueprint.updatedAt =
      new Date().toISOString();

    this.blueprints.set(
      blueprint.id,
      blueprint,
    );

    return structuredClone(
      installation,
    );
  }

  search(
    query: MarketplaceSearchQuery,
  ): MarketplaceSearchResult {
    const items =
      Array.from(
        this.blueprints.values(),
      ).filter(
        (blueprint) => {
          if (
            blueprint.status !==
            MarketplaceBlueprintStatus.PUBLISHED
          ) {
            return false;
          }

          if (
            query.text &&
            ![
              blueprint.key,
              blueprint.name,
              blueprint.description,
            ]
              .join(" ")
              .toLowerCase()
              .includes(
                query.text.toLowerCase(),
              )
          ) {
            return false;
          }

          if (
            query.capability &&
            !blueprint.capabilities.includes(
              query.capability,
            )
          ) {
            return false;
          }

          if (
            query.publisher &&
            blueprint.publisher !==
              query.publisher
          ) {
            return false;
          }

          if (
            query.minimumRating !==
              undefined &&
            blueprint.rating <
              query.minimumRating
          ) {
            return false;
          }

          return true;
        },
      );

    return {
      items:
        items.map(
          (item) =>
            structuredClone(item),
        ),
      total:
        items.length,
      generatedAt:
        new Date().toISOString(),
    };
  }

  get(
    blueprintId: string,
  ): MarketplaceBlueprint {
    const blueprint =
      this.blueprints.get(
        blueprintId,
      );

    if (!blueprint) {
      throw new Error(
        `Marketplace blueprint not found: ${blueprintId}`,
      );
    }

    return structuredClone(
      blueprint,
    );
  }
}
