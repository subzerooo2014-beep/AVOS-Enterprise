import { Injectable } from '@nestjs/common';
import {
  NetworkCoordinationPlan,
  NetworkGovernanceDecision,
  NetworkNode,
  NetworkWorkload,
  ResilienceEvent,
  RoutingDecision,
} from './autonomous-production-network.types';

@Injectable()
export class AutonomousProductionNetworkStore {
  readonly nodes = new Map<string, NetworkNode>();
  readonly workloads = new Map<string, NetworkWorkload>();
  readonly routingDecisions = new Map<string, RoutingDecision>();
  readonly coordinationPlans = new Map<string, NetworkCoordinationPlan>();
  readonly resilienceEvents: ResilienceEvent[] = [];
  readonly governanceDecisions: NetworkGovernanceDecision[] = [];
}
