export type G1Capability =
  | "GLOBAL_DESIGN_SYSTEM"
  | "AVOS_BRAND_RUNTIME"
  | "LOGO_SYSTEM"
  | "LIGHT_THEME_ENGINE"
  | "DARK_THEME_ENGINE"
  | "RTL_LTR_ENGINE"
  | "ARABIC_LOCALIZATION"
  | "ENGLISH_LOCALIZATION"
  | "RESPONSIVE_WEB_SHELL"
  | "MOBILE_APP_SHELL"
  | "ACCESSIBILITY_ENGINE"
  | "GLOBAL_NAVIGATION"
  | "GLOBAL_SEARCH"
  | "NOTIFICATION_CENTER"
  | "PROFILE_CENTER"
  | "ONBOARDING_ENGINE"
  | "AUTHENTICATION_EXPERIENCE"
  | "LANDING_EXPERIENCE"
  | "MARKETPLACE_EXPERIENCE"
  | "VEHICLE_DETAIL_EXPERIENCE"
  | "DEAL_EXPERIENCE"
  | "AUCTION_EXPERIENCE"
  | "CHAT_EXPERIENCE"
  | "AI_ASSISTANT_EXPERIENCE"
  | "ADMIN_EXPERIENCE"
  | "DEALER_EXPERIENCE"
  | "PARTNER_EXPERIENCE"
  | "DESIGN_TOKENS"
  | "UI_COMPONENT_LIBRARY"
  | "EXPERIENCE_CONFIGURATION_CENTER";

export interface G1ThemeProfile {
  id: string;
  tenantId: string;
  name: string;
  mode: "LIGHT" | "DARK" | "SYSTEM";
  direction: "RTL" | "LTR";
  locale: "ar-AE" | "en-AE";
  tokens: Record<string, string | number>;
  status: "DRAFT" | "ACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface G1NavigationProfile {
  id: string;
  tenantId: string;
  role: string;
  items: string[];
  mobileItems: string[];
  createdAt: string;
  updatedAt: string;
}

export interface G1ExperienceConfig {
  id: string;
  tenantId: string;
  experience:
    | "LANDING"
    | "AUTH"
    | "MARKETPLACE"
    | "VEHICLE_DETAIL"
    | "DEAL"
    | "AUCTION"
    | "CHAT"
    | "AI_ASSISTANT"
    | "ADMIN"
    | "DEALER"
    | "PARTNER";
  enabled: boolean;
  configuration: Record<string, string | number | boolean>;
  createdAt: string;
  updatedAt: string;
}

export interface G1ComponentDefinition {
  id: string;
  code: string;
  name: string;
  category: string;
  responsive: boolean;
  accessible: boolean;
  variants: string[];
  createdAt: string;
}