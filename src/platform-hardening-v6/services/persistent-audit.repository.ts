import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PersistentAuditRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  get model(): any {
    return (this.prisma as any).persistentAuditEvent;
  }

  findLatest() {
    return this.model.findFirst({
      orderBy: {
        sequence: "desc",
      },
    });
  }

  findFirst() {
    return this.model.findFirst({
      orderBy: {
        sequence: "asc",
      },
    });
  }

  findById(id: string) {
    return this.model.findUnique({
      where: { id },
    });
  }

  findBySequence(sequence: number) {
    return this.model.findUnique({
      where: { sequence },
    });
  }

  findMany(input: {
    limit: number;
    eventType?: string;
    severity?: string;
    actor?: string;
    correlationId?: string;
  }) {
    const where: Record<string, unknown> = {};

    if (input.eventType) {
      where.eventType = input.eventType;
    }

    if (input.severity) {
      where.severity = input.severity;
    }

    if (input.actor) {
      where.actor = input.actor;
    }

    if (input.correlationId) {
      where.correlationId = input.correlationId;
    }

    return this.model.findMany({
      where,
      orderBy: {
        sequence: "desc",
      },
      take: input.limit,
    });
  }

  findAllAscending() {
    return this.model.findMany({
      orderBy: {
        sequence: "asc",
      },
    });
  }

  count() {
    return this.model.count();
  }

  create(data: Record<string, unknown>) {
    return this.model.create({
      data,
    });
  }

  getSeverityCounts() {
    return this.model.groupBy({
      by: ["severity"],
      _count: {
        _all: true,
      },
    });
  }

  getTypeCounts() {
    return this.model.groupBy({
      by: ["eventType"],
      _count: {
        _all: true,
      },
    });
  }
}
