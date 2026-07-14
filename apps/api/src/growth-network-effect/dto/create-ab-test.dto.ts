export class CreateAbTestDto { name!: string; variantA!: Record<string, unknown>; variantB!: Record<string, unknown>; splitPercent?: number; }
