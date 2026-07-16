export interface FactoryV3ArtifactSignature {
  id: string;
  artifactId: string;
  algorithm: string;
  signature: string;
  verified: boolean;
}