
export type CapabilityStatus = "concept"|"prototype"|"shared"|"core"|"platform"|"product"|"legacy";
export interface CapabilityRecord {
  readonly id:string; readonly key:string; readonly name:string; readonly status:CapabilityStatus;
  readonly version:string; readonly owner:string; readonly contracts:readonly string[];
  readonly dependencies:readonly string[]; readonly tags:readonly string[];
  readonly trustScore:number; readonly createdAt:string; readonly updatedAt:string;
}