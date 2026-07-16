import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  FoundationComponentDefinition,
  FoundationComponentStatus
} from "../foundation-pack-18.types";
import { FoundationValidationAuditService } from "../observability/foundation-validation-audit.service";

@Injectable()
export class FoundationComponentRegistryService {
  private readonly components =
    new Map<string, FoundationComponentDefinition>();

  constructor(
    private readonly audit: FoundationValidationAuditService
  ) {
    this.seed();
  }

  list() {
    return Array.from(this.components.values());
  }

  get(id: string) {
    const component = this.components.get(id);

    if (!component) {
      throw new NotFoundException(
        `Foundation component not found: ${id}`
      );
    }

    return component;
  }

  register(
    input: Omit<
      FoundationComponentDefinition,
      "updatedAt"
    >,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    const component: FoundationComponentDefinition = {
      ...input,
      dependencies: Array.from(
        new Set(input.dependencies)
      ),
      updatedAt: new Date().toISOString()
    };

    this.components.set(component.id, component);

    this.audit.record({
      correlationId: context.correlationId,
      category: "registry",
      action: "foundation-component-registered",
      subjectId: component.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        domain: component.domain,
        required: component.required
      }
    });

    return component;
  }

  updateStatus(
    id: string,
    status: FoundationComponentStatus,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    const current = this.get(id);

    const updated: FoundationComponentDefinition = {
      ...current,
      status,
      updatedAt: new Date().toISOString()
    };

    this.components.set(id, updated);

    this.audit.record({
      correlationId: context.correlationId,
      category: "registry",
      action: `foundation-component-status:${status}`,
      subjectId: id,
      actorIdentityId: context.actorIdentityId,
      outcome:
        status === "missing" ||
        status === "degraded"
          ? "warning"
          : "success",
      metadata: {
        previousStatus: current.status
      }
    });

    return updated;
  }

  required() {
    return this.list().filter(
      (component) => component.required
    );
  }

  summary() {
    const components = this.list();

    return {
      total: components.length,
      required: components.filter(
        (component) => component.required
      ).length,
      present: components.filter(
        (component) => component.status === "present"
      ).length,
      partial: components.filter(
        (component) => component.status === "partial"
      ).length,
      missing: components.filter(
        (component) => component.status === "missing"
      ).length,
      degraded: components.filter(
        (component) => component.status === "degraded"
      ).length
    };
  }

  private seed() {
    const now = new Date().toISOString();

    const components: FoundationComponentDefinition[] = [
      ["foundation:control-plane","Foundation Control Plane","control-plane","FoundationControlPlaneModule","/foundation-control-plane","1.0.0",[]],
      ["foundation:trust","Trust Framework","trust","FoundationCompletionPack7Module","/foundation-completion-v7","7.0.0",["foundation:control-plane"]],
      ["foundation:governance","Governance OS","governance","FoundationCompletionPack8Module","/foundation-completion-v8","8.0.0",["foundation:trust"]],
      ["foundation:identity","Digital Identity","identity","FoundationCompletionPack9Module","/foundation-completion-v9","9.0.0",["foundation:governance"]],
      ["foundation:metadata","Metadata Foundation","metadata","FoundationCompletionPack14Module","/foundation-completion-v14","14.0.0",["foundation:identity"]],
      ["foundation:dependency-graph","Dependency Graph","dependency-graph","FoundationCompletionPack9Module","/foundation-completion-v9","9.0.0",["foundation:identity"]],
      ["foundation:architecture","Architecture Intelligence","architecture","FoundationCompletionPack10Module","/foundation-completion-v10","10.0.0",["foundation:metadata","foundation:dependency-graph"]],
      ["foundation:evolution","Architecture Evolution","evolution","FoundationCompletionPack11Module","/foundation-completion-v11","11.0.0",["foundation:architecture"]],
      ["foundation:memory","Enterprise Memory","memory","FoundationCompletionPack12Module","/foundation-completion-v12","12.0.0",["foundation:identity"]],
      ["foundation:knowledge","Knowledge Graph","knowledge","FoundationCompletionPack13Module","/foundation-completion-v13","13.0.0",["foundation:memory","foundation:metadata"]],
      ["foundation:digital-dna","Digital DNA","digital-dna","FoundationCompletionPack15Module","/foundation-completion-v15","15.0.0",["foundation:metadata","foundation:knowledge"]],
      ["foundation:digital-genome","Digital Genome","digital-genome","FoundationCompletionPack16Module","/foundation-completion-v16","16.0.0",["foundation:digital-dna"]],
      ["foundation:sdk","Foundation SDK","sdk","FoundationCompletionPack17Module","/foundation-completion-v17","17.0.0",["foundation:identity","foundation:memory","foundation:knowledge","foundation:metadata","foundation:digital-dna","foundation:digital-genome"]]
    ].map((item) => ({
      id: item[0] as string,
      name: item[1] as string,
      domain: item[2] as FoundationComponentDefinition["domain"],
      required: true,
      expectedModule: item[3] as string,
      expectedRoute: item[4] as string,
      minimumVersion: item[5] as string,
      dependencies: item[6] as string[],
      status: "present" as const,
      metadata: {},
      updatedAt: now
    }));

    for (const component of components) {
      this.components.set(component.id, component);
    }
  }
}
