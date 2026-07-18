import { GenesisBlueprint } from "../types/genesis-platform.types";

export class CreateGenesisSessionDto implements GenesisBlueprint {
  id!: string;
  name!: string;
  version!: string;
  purpose!: string;
  requestedCapabilities: string[] = [];
  artifacts: GenesisBlueprint["artifacts"] = [];
  policies: string[] = [];
  metadata: Record<string, unknown> = {};
}
