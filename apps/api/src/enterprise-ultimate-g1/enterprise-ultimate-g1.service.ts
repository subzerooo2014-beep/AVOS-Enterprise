import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  G1_CAPABILITIES,
  G1_DEFAULT_TOKENS,
} from "./enterprise-ultimate-g1.registry";
import {
  G1ComponentDefinition,
  G1ExperienceConfig,
  G1NavigationProfile,
  G1ThemeProfile,
} from "./enterprise-ultimate-g1.types";

@Injectable()
export class EnterpriseUltimateG1Service {
  private readonly themes = new Map<string, G1ThemeProfile>();
  private readonly navigation = new Map<string, G1NavigationProfile>();
  private readonly experiences = new Map<string, G1ExperienceConfig>();
  private readonly components = new Map<string, G1ComponentDefinition>();

  framework() {
    return {
      system: "AVOS Enterprise Ultimate Mega Bundle G1",
      version: "1.0.0",
      status: "READY",
      capabilityCount: Object.keys(G1_CAPABILITIES).length,
      capabilities: structuredClone(G1_CAPABILITIES),
      defaultTokens: structuredClone(G1_DEFAULT_TOKENS),
    };
  }

  createTheme(
    input: Omit<G1ThemeProfile, "id" | "status" | "createdAt" | "updatedAt">,
  ) {
    const now = new Date().toISOString();
    const theme: G1ThemeProfile = {
      ...input,
      id: randomUUID(),
      status: "DRAFT",
      tokens: { ...G1_DEFAULT_TOKENS, ...input.tokens },
      createdAt: now,
      updatedAt: now,
    };

    this.themes.set(theme.id, theme);
    return this.cloneTheme(theme);
  }

  activateTheme(id: string) {
    const theme = this.requireTheme(id);
    theme.status = "ACTIVE";
    theme.updatedAt = new Date().toISOString();
    this.themes.set(id, theme);
    return this.cloneTheme(theme);
  }

  createNavigation(
    input: Omit<G1NavigationProfile, "id" | "createdAt" | "updatedAt">,
  ) {
    const now = new Date().toISOString();
    const profile: G1NavigationProfile = {
      ...input,
      id: randomUUID(),
      items: [...input.items],
      mobileItems: [...input.mobileItems],
      createdAt: now,
      updatedAt: now,
    };

    this.navigation.set(profile.id, profile);
    return this.cloneNavigation(profile);
  }

  configureExperience(
    input: Omit<G1ExperienceConfig, "id" | "createdAt" | "updatedAt">,
  ) {
    const now = new Date().toISOString();
    const config: G1ExperienceConfig = {
      ...input,
      id: randomUUID(),
      configuration: { ...input.configuration },
      createdAt: now,
      updatedAt: now,
    };

    this.experiences.set(config.id, config);
    return this.cloneExperience(config);
  }

  registerComponent(
    input: Omit<G1ComponentDefinition, "id" | "createdAt">,
  ) {
    const component: G1ComponentDefinition = {
      ...input,
      id: randomUUID(),
      variants: [...input.variants],
      createdAt: new Date().toISOString(),
    };

    this.components.set(component.id, component);
    return { ...component, variants: [...component.variants] };
  }

  resolveExperience(
    tenantId: string,
    locale: "ar-AE" | "en-AE",
    role: string,
  ) {
    const activeTheme =
      Array.from(this.themes.values()).find(
        (item) =>
          item.tenantId === tenantId &&
          item.locale === locale &&
          item.status === "ACTIVE",
      ) ?? null;

    const navigation =
      Array.from(this.navigation.values()).find(
        (item) => item.tenantId === tenantId && item.role === role,
      ) ?? null;

    const experiences = Array.from(this.experiences.values()).filter(
      (item) => item.tenantId === tenantId && item.enabled,
    );

    return {
      tenantId,
      locale,
      role,
      direction: locale === "ar-AE" ? "RTL" : "LTR",
      theme: activeTheme ? this.cloneTheme(activeTheme) : null,
      navigation: navigation ? this.cloneNavigation(navigation) : null,
      experiences: experiences.map((item) => this.cloneExperience(item)),
      components: Array.from(this.components.values()).map((item) => ({
        ...item,
        variants: [...item.variants],
      })),
      resolvedAt: new Date().toISOString(),
    };
  }

  commandCenter(tenantId?: string) {
    const themes = this.filterTenant(Array.from(this.themes.values()), tenantId);
    const navigation = this.filterTenant(
      Array.from(this.navigation.values()),
      tenantId,
    );
    const experiences = this.filterTenant(
      Array.from(this.experiences.values()),
      tenantId,
    );

    return {
      system: "AVOS Enterprise Ultimate Mega Bundle G1",
      tenantId: tenantId ?? "ALL",
      themes: themes.length,
      activeThemes: themes.filter((item) => item.status === "ACTIVE").length,
      navigationProfiles: navigation.length,
      experiences: experiences.length,
      enabledExperiences: experiences.filter((item) => item.enabled).length,
      components: this.components.size,
      accessibleComponents: Array.from(this.components.values()).filter(
        (item) => item.accessible,
      ).length,
      responsiveComponents: Array.from(this.components.values()).filter(
        (item) => item.responsive,
      ).length,
      generatedAt: new Date().toISOString(),
    };
  }

  private requireTheme(id: string) {
    const item = this.themes.get(id);
    if (!item) throw new Error(`Theme not found: ${id}`);
    return item;
  }

  private filterTenant<T extends { tenantId: string }>(
    items: T[],
    tenantId?: string,
  ) {
    return tenantId
      ? items.filter((item) => item.tenantId === tenantId)
      : items;
  }

  private cloneTheme(item: G1ThemeProfile): G1ThemeProfile {
    return { ...item, tokens: { ...item.tokens } };
  }

  private cloneNavigation(item: G1NavigationProfile): G1NavigationProfile {
    return {
      ...item,
      items: [...item.items],
      mobileItems: [...item.mobileItems],
    };
  }

  private cloneExperience(item: G1ExperienceConfig): G1ExperienceConfig {
    return {
      ...item,
      configuration: { ...item.configuration },
    };
  }
}