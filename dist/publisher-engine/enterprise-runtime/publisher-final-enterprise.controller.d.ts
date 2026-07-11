import { PublisherFinalEnterpriseService } from "./publisher-final-enterprise.service";
export declare class PublisherFinalEnterpriseController {
    private readonly service;
    constructor(service: PublisherFinalEnterpriseService);
    live(): Promise<{
        success: boolean;
        engine: {
            name: string;
            version: string;
        };
        queue: {
            queued: number;
            processing: number;
            retrying: number;
            failed: number;
            dead: number;
            delivered: number;
            pending: number;
        };
        worker: any;
        providers: {
            channel: import("..").ExternalProviderChannel;
            configured: boolean;
        }[];
        runtimeMetrics: {
            channels: {
                averageDurationMs: number;
                channel: string;
                attempted: number;
                published: number;
                failed: number;
                retried: number;
                deadLettered: number;
                totalDurationMs: number;
                lastDurationMs: number;
                lastAttemptAt?: Date;
                lastSuccessAt?: Date;
                lastFailureAt?: Date;
            }[];
            totals: {
                attempted: number;
                published: number;
                failed: number;
                retried: number;
                deadLettered: number;
            };
            generatedAt: Date;
        };
        circuits: import("..").PublisherCircuitSnapshot[];
        channels: string[];
        generatedAt: Date;
    }>;
    health(): Promise<{
        success: boolean;
        status: string;
        risk: string;
        checks: {
            workerRunning: any;
            automaticPolling: any;
            providersHealthy: boolean;
            openCircuits: number;
            queuePressure: number;
            deadLetters: number;
            failedEvents: number;
        };
        providerHealth: any[];
        unhealthyProviders: any[];
        circuits: import("..").PublisherCircuitSnapshot[];
        recommendations: string[];
        checkedAt: Date;
    }>;
    executiveSummary(): Promise<{
        success: boolean;
        title: string;
        overallStatus: string;
        operationalRisk: string;
        overview: {
            totalPublications: number;
            delivered: number;
            failed: number;
            queued: number;
            processing: number;
            cancelled: number;
            rejected: number;
            awaitingCredentials: number;
            successRate: number;
            averageAttempts: number;
            averageDeliveryDurationMs: number;
            receiptCoverageRate: number;
            versionedPublicationRate: number;
        };
        kpis: {
            totalPublications: {
                current: number;
                previous: number;
                changePercent: number;
                trend: string;
                improved: boolean | null;
            };
            delivered: {
                current: number;
                previous: number;
                changePercent: number;
                trend: string;
                improved: boolean | null;
            };
            failed: {
                current: number;
                previous: number;
                changePercent: number;
                trend: string;
                improved: boolean | null;
            };
            successRate: {
                current: number;
                previous: number;
                changePercent: number;
                trend: string;
                improved: boolean | null;
            };
            averageDeliveryDurationMs: {
                current: number;
                previous: number;
                changePercent: number;
                trend: string;
                improved: boolean | null;
            };
            averageAttempts: {
                current: number;
                previous: number;
                changePercent: number;
                trend: string;
                improved: boolean | null;
            };
            receiptCoverageRate: {
                current: number;
                previous: number;
                changePercent: number;
                trend: string;
                improved: boolean | null;
            };
            versionedPublicationRate: {
                current: number;
                previous: number;
                changePercent: number;
                trend: string;
                improved: boolean | null;
            };
        };
        sla: {
            sla: {
                deliveryTimeMet: boolean;
                successRateMet: boolean;
                receiptCoverageMet: boolean;
                attemptsMet: boolean;
                compliant: boolean;
            };
            total: any;
            delivered: any;
            failed: any;
            successRate: number;
            receiptCoverageRate: number;
            averageAttempts: number;
            averageDeliveryDurationMs: number;
        };
        bestChannel: any;
        weakestChannel: any;
        failures: {
            failures: number;
            byStatus: Record<string, number>;
        };
        recommendations: string[];
        generatedAt: Date;
    }>;
    productionReadiness(): Promise<{
        success: boolean;
        ready: boolean;
        readinessScore: number;
        environment: string;
        deliveryMode: string;
        checks: {
            name: string;
            passed: boolean;
        }[];
        totals: {
            checks: number;
            passed: number;
            failed: number;
        };
        blockingIssues: string[];
        note: string;
        checkedAt: Date;
    }>;
    report(): Promise<{
        success: boolean;
        system: string;
        completion: {
            publisherEngine: string;
            enterpriseAnalytics: string;
            versioning: string;
            replayAndClone: string;
            webhookReceipts: string;
            reliability: string;
            productionConnectors: string;
        };
        live: {
            success: boolean;
            engine: {
                name: string;
                version: string;
            };
            queue: {
                queued: number;
                processing: number;
                retrying: number;
                failed: number;
                dead: number;
                delivered: number;
                pending: number;
            };
            worker: any;
            providers: {
                channel: import("..").ExternalProviderChannel;
                configured: boolean;
            }[];
            runtimeMetrics: {
                channels: {
                    averageDurationMs: number;
                    channel: string;
                    attempted: number;
                    published: number;
                    failed: number;
                    retried: number;
                    deadLettered: number;
                    totalDurationMs: number;
                    lastDurationMs: number;
                    lastAttemptAt?: Date;
                    lastSuccessAt?: Date;
                    lastFailureAt?: Date;
                }[];
                totals: {
                    attempted: number;
                    published: number;
                    failed: number;
                    retried: number;
                    deadLettered: number;
                };
                generatedAt: Date;
            };
            circuits: import("..").PublisherCircuitSnapshot[];
            channels: string[];
            generatedAt: Date;
        };
        health: {
            success: boolean;
            status: string;
            risk: string;
            checks: {
                workerRunning: any;
                automaticPolling: any;
                providersHealthy: boolean;
                openCircuits: number;
                queuePressure: number;
                deadLetters: number;
                failedEvents: number;
            };
            providerHealth: any[];
            unhealthyProviders: any[];
            circuits: import("..").PublisherCircuitSnapshot[];
            recommendations: string[];
            checkedAt: Date;
        };
        executive: {
            success: boolean;
            title: string;
            overallStatus: string;
            operationalRisk: string;
            overview: {
                totalPublications: number;
                delivered: number;
                failed: number;
                queued: number;
                processing: number;
                cancelled: number;
                rejected: number;
                awaitingCredentials: number;
                successRate: number;
                averageAttempts: number;
                averageDeliveryDurationMs: number;
                receiptCoverageRate: number;
                versionedPublicationRate: number;
            };
            kpis: {
                totalPublications: {
                    current: number;
                    previous: number;
                    changePercent: number;
                    trend: string;
                    improved: boolean | null;
                };
                delivered: {
                    current: number;
                    previous: number;
                    changePercent: number;
                    trend: string;
                    improved: boolean | null;
                };
                failed: {
                    current: number;
                    previous: number;
                    changePercent: number;
                    trend: string;
                    improved: boolean | null;
                };
                successRate: {
                    current: number;
                    previous: number;
                    changePercent: number;
                    trend: string;
                    improved: boolean | null;
                };
                averageDeliveryDurationMs: {
                    current: number;
                    previous: number;
                    changePercent: number;
                    trend: string;
                    improved: boolean | null;
                };
                averageAttempts: {
                    current: number;
                    previous: number;
                    changePercent: number;
                    trend: string;
                    improved: boolean | null;
                };
                receiptCoverageRate: {
                    current: number;
                    previous: number;
                    changePercent: number;
                    trend: string;
                    improved: boolean | null;
                };
                versionedPublicationRate: {
                    current: number;
                    previous: number;
                    changePercent: number;
                    trend: string;
                    improved: boolean | null;
                };
            };
            sla: {
                sla: {
                    deliveryTimeMet: boolean;
                    successRateMet: boolean;
                    receiptCoverageMet: boolean;
                    attemptsMet: boolean;
                    compliant: boolean;
                };
                total: any;
                delivered: any;
                failed: any;
                successRate: number;
                receiptCoverageRate: number;
                averageAttempts: number;
                averageDeliveryDurationMs: number;
            };
            bestChannel: any;
            weakestChannel: any;
            failures: {
                failures: number;
                byStatus: Record<string, number>;
            };
            recommendations: string[];
            generatedAt: Date;
        };
        productionReadiness: {
            success: boolean;
            ready: boolean;
            readinessScore: number;
            environment: string;
            deliveryMode: string;
            checks: {
                name: string;
                passed: boolean;
            }[];
            totals: {
                checks: number;
                passed: number;
                failed: number;
            };
            blockingIssues: string[];
            note: string;
            checkedAt: Date;
        };
        generatedAt: Date;
    }>;
}
