export class CreateLineageNodeDto {
  assetId!: string;
  systemName!: string;
  componentName!: string;
  nodeType!:
    | "source"
    | "processor"
    | "store"
    | "consumer"
    | "archive";
}
