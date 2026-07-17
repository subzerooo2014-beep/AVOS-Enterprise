import { IdentityKind, TrustLevel } from "../contracts/digital-identity.contracts";

export interface RegisterIdentityDto {
  readonly kind: IdentityKind;
  readonly displayName: string;
  readonly description?: string;
  readonly externalReference?: string;
  readonly ownerIdentityId?: string;
  readonly tags?: readonly string[];
  readonly metadata?: Readonly<Record<string, unknown>>;
  readonly purpose?: string;
  readonly capabilities?: readonly string[];
  readonly policies?: readonly string[];
  readonly permissions?: readonly string[];
  readonly dependencies?: readonly string[];
  readonly contracts?: readonly string[];
  readonly provenance?: readonly string[];
}

export interface UpdateIdentityDto {
  readonly displayName?: string;
  readonly description?: string;
  readonly tags?: readonly string[];
  readonly metadata?: Readonly<Record<string, unknown>>;
  readonly trustLevel?: TrustLevel;
}

export interface LinkIdentityDto {
  readonly sourceIdentityId: string;
  readonly targetIdentityId: string;
  readonly type: string;
  readonly strength?: number;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface VerifyIdentityDto {
  readonly identityId: string;
  readonly approved: boolean;
  readonly actor?: string;
  readonly evidence?: readonly string[];
}

export interface MergeIdentityDto {
  readonly primaryIdentityId: string;
  readonly duplicateIdentityId: string;
  readonly actor?: string;
}

export interface EvaluateIdentityPolicyDto {
  readonly identityId: string;
  readonly action: string;
  readonly actor?: string;
}
