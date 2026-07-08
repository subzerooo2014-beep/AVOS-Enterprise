export class PlatformHealthDto {
  status!: string;
  timestamp!: string;
  modules!: Record<string, boolean>;
  counters!: Record<string, number>;
}
