import { UltraBValue } from "../contracts";

export interface DigitalTwinEntity {
  key: string;
  kind: string;
  state: Record<string, UltraBValue>;
  relationships: string[];
  updatedAt: string;
}

export interface DigitalTwinSnapshot {
  id: string;
  systemKey: string;
  version: string;
  entities: DigitalTwinEntity[];
  createdAt: string;
}

export interface DigitalTwinDiff {
  added: string[];
  removed: string[];
  changed: string[];
  generatedAt: string;
}
