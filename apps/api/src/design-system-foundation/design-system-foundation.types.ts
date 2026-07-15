export type DesignTokenCategory =
  | "COLOR"
  | "TYPOGRAPHY"
  | "SPACING"
  | "RADIUS"
  | "SHADOW"
  | "MOTION"
  | "ELEVATION"
  | "BREAKPOINT";

export interface DesignToken {
  name: string;
  category: DesignTokenCategory;
  value: string | number;
  description: string;
}

export interface DesignComponentDefinition {
  name: string;
  category: "ACTION" | "INPUT" | "NAVIGATION" | "FEEDBACK" | "DATA" | "LAYOUT";
  accessibilityRequired: boolean;
  responsiveRequired: boolean;
  states: string[];
}

export interface AvosDesignSystemFoundation {
  version: string;
  status: "OFFICIAL";
  brandName: "AVOS Enterprise";
  tagline: "The Operating System for Mobility";
  themeStrategy: "LIGHT_FIRST";
  bilingualReady: boolean;
  accessibilityStandard: string;
  tokens: DesignToken[];
  components: DesignComponentDefinition[];
  governanceRules: string[];
}