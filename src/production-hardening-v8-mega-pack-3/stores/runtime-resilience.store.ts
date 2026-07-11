import { Injectable } from "@nestjs/common";
import {
  EvidenceEntry,
  ResilienceAction,
  ResilienceConfiguration,
  ResiliencePolicy,
  RuntimeBaseline,
  RuntimeIncident,
  RuntimeRiskEvaluation,
  RuntimeSignal,
} from "../contracts/runtime-resilience.contracts";
import { RuntimeControlMode } from "../contracts/runtime-resilience.enums";
import { cloneJson } from "../utils/canonical-json.util";

@Injectable()
export class RuntimeResilienceStore {
  private readonly configurations = new Map<
    string,
    ResilienceConfiguration
  >();

  private readonly policies = new Map<string, ResiliencePolicy>();

  private readonly riskEvaluations = new Map<
    string,
    RuntimeRiskEvaluation
  >();

  private readonly signals = new Map<string, RuntimeSignal>();

  private readonly incidents = new Map<string, RuntimeIncident>();

  private readonly actions = new Map<string, ResilienceAction>();

  private readonly baselines = new Map<string, RuntimeBaseline>();

  private readonly evidenceEntries: EvidenceEntry[] = [];

  private controlMode = RuntimeControlMode.ENFORCE;

  getControlMode(): RuntimeControlMode {
    return this.controlMode;
  }

  setControlMode(controlMode: RuntimeControlMode): void {
    this.controlMode = controlMode;
  }

  saveConfiguration(
    configuration: ResilienceConfiguration,
  ): ResilienceConfiguration {
    const stored = cloneJson(configuration);
    this.configurations.set(stored.id, stored);
    return cloneJson(stored);
  }

  getConfiguration(id: string): ResilienceConfiguration | undefined {
    const item = this.configurations.get(id);
    return item ? cloneJson(item) : undefined;
  }

  listConfigurations(): ResilienceConfiguration[] {
    return Array.from(this.configurations.values())
      .map((item) => cloneJson(item))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  findConfigurationsByKey(key: string): ResilienceConfiguration[] {
    return this.listConfigurations()
      .filter((item) => item.key === key)
      .sort((a, b) => b.version - a.version);
  }

  savePolicy(policy: ResiliencePolicy): ResiliencePolicy {
    const stored = cloneJson(policy);
    this.policies.set(stored.id, stored);
    return cloneJson(stored);
  }

  getPolicy(id: string): ResiliencePolicy | undefined {
    const item = this.policies.get(id);
    return item ? cloneJson(item) : undefined;
  }

  listPolicies(): ResiliencePolicy[] {
    return Array.from(this.policies.values())
      .map((item) => cloneJson(item))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  findPoliciesByKey(key: string): ResiliencePolicy[] {
    return this.listPolicies()
      .filter((item) => item.key === key)
      .sort((a, b) => b.version - a.version);
  }

  saveRiskEvaluation(
    evaluation: RuntimeRiskEvaluation,
  ): RuntimeRiskEvaluation {
    const stored = cloneJson(evaluation);
    this.riskEvaluations.set(stored.id, stored);
    return cloneJson(stored);
  }

  getRiskEvaluation(id: string): RuntimeRiskEvaluation | undefined {
    const item = this.riskEvaluations.get(id);
    return item ? cloneJson(item) : undefined;
  }

  listRiskEvaluations(): RuntimeRiskEvaluation[] {
    return Array.from(this.riskEvaluations.values())
      .map((item) => cloneJson(item))
      .sort((a, b) => b.evaluatedAt.localeCompare(a.evaluatedAt));
  }

  saveSignal(signal: RuntimeSignal): RuntimeSignal {
    const stored = cloneJson(signal);
    this.signals.set(stored.id, stored);
    return cloneJson(stored);
  }

  getSignal(id: string): RuntimeSignal | undefined {
    const item = this.signals.get(id);
    return item ? cloneJson(item) : undefined;
  }

  listSignals(): RuntimeSignal[] {
    return Array.from(this.signals.values())
      .map((item) => cloneJson(item))
      .sort((a, b) => b.observedAt.localeCompare(a.observedAt));
  }

  saveIncident(incident: RuntimeIncident): RuntimeIncident {
    const stored = cloneJson(incident);
    this.incidents.set(stored.id, stored);
    return cloneJson(stored);
  }

  getIncident(id: string): RuntimeIncident | undefined {
    const item = this.incidents.get(id);
    return item ? cloneJson(item) : undefined;
  }

  listIncidents(): RuntimeIncident[] {
    return Array.from(this.incidents.values())
      .map((item) => cloneJson(item))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  saveAction(action: ResilienceAction): ResilienceAction {
    const stored = cloneJson(action);
    this.actions.set(stored.id, stored);
    return cloneJson(stored);
  }

  getAction(id: string): ResilienceAction | undefined {
    const item = this.actions.get(id);
    return item ? cloneJson(item) : undefined;
  }

  listActions(): ResilienceAction[] {
    return Array.from(this.actions.values())
      .map((item) => cloneJson(item))
      .sort((a, b) => b.requestedAt.localeCompare(a.requestedAt));
  }

  saveBaseline(baseline: RuntimeBaseline): RuntimeBaseline {
    const stored = cloneJson(baseline);

    if (stored.active) {
      for (const existing of this.baselines.values()) {
        if (
          existing.environment === stored.environment &&
          existing.namespace === stored.namespace &&
          existing.active
        ) {
          existing.active = false;
          this.baselines.set(existing.id, existing);
        }
      }
    }

    this.baselines.set(stored.id, stored);
    return cloneJson(stored);
  }

  getBaseline(id: string): RuntimeBaseline | undefined {
    const item = this.baselines.get(id);
    return item ? cloneJson(item) : undefined;
  }

  listBaselines(): RuntimeBaseline[] {
    return Array.from(this.baselines.values())
      .map((item) => cloneJson(item))
      .sort((a, b) => b.capturedAt.localeCompare(a.capturedAt));
  }

  appendEvidence(entry: EvidenceEntry): EvidenceEntry {
    const stored = cloneJson(entry);
    this.evidenceEntries.push(stored);
    return cloneJson(stored);
  }

  listEvidenceEntries(): EvidenceEntry[] {
    return this.evidenceEntries.map((item) => cloneJson(item));
  }

  getLatestEvidenceEntry(): EvidenceEntry | undefined {
    const item =
      this.evidenceEntries.length > 0
        ? this.evidenceEntries[
            this.evidenceEntries.length - 1
          ]
        : undefined;

    return item ? cloneJson(item) : undefined;
  }

  clear(): void {
    this.configurations.clear();
    this.policies.clear();
    this.riskEvaluations.clear();
    this.signals.clear();
    this.incidents.clear();
    this.actions.clear();
    this.baselines.clear();
    this.evidenceEntries.splice(0, this.evidenceEntries.length);
    this.controlMode = RuntimeControlMode.ENFORCE;
  }
}

