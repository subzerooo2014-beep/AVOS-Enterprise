import { UltraEValue } from "./contracts";

export interface GenomeTrait {
  key: string;
  category:
    | "architecture"
    | "security"
    | "operations"
    | "data"
    | "ai"
    | "governance";
  strength: number;
  adaptable: boolean;
  metadata: Record<string, UltraEValue>;
}

export interface EnterpriseGenomeProfile {
  organizationKey: string;
  traits: GenomeTrait[];
  generation: number;
  compatibilityScore: number;
  generatedAt: string;
}

export interface GenomeMutation {
  traitKey: string;
  delta: number;
  reason: string;
}

export class EnterpriseGenome {
  create(
    organizationKey: string,
    traits: readonly GenomeTrait[],
  ): EnterpriseGenomeProfile {
    return {
      organizationKey,
      traits: traits.map((trait) => structuredClone(trait)),
      generation: 1,
      compatibilityScore: this.compatibility(traits),
      generatedAt: new Date().toISOString(),
    };
  }

  evolve(
    profile: EnterpriseGenomeProfile,
    mutations: readonly GenomeMutation[],
  ): EnterpriseGenomeProfile {
    const mutationMap = new Map(
      mutations.map((mutation) => [mutation.traitKey, mutation]),
    );

    const traits = profile.traits.map((trait) => {
      const mutation = mutationMap.get(trait.key);
      if (!mutation || !trait.adaptable) return structuredClone(trait);

      return {
        ...structuredClone(trait),
        strength: Math.max(
          0,
          Math.min(100, trait.strength + mutation.delta),
        ),
        metadata: {
          ...structuredClone(trait.metadata),
          lastMutationReason: mutation.reason,
        },
      };
    });

    return {
      organizationKey: profile.organizationKey,
      traits,
      generation: profile.generation + 1,
      compatibilityScore: this.compatibility(traits),
      generatedAt: new Date().toISOString(),
    };
  }

  private compatibility(traits: readonly GenomeTrait[]): number {
    if (traits.length === 0) return 100;

    const categoryCoverage = new Set(traits.map((trait) => trait.category)).size;
    const averageStrength =
      traits.reduce((sum, trait) => sum + trait.strength, 0) /
      traits.length;

    return Math.round(
      Math.min(100, averageStrength * 0.8 + categoryCoverage * 4),
    );
  }
}
