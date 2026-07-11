import { PublisherAdapter, PublisherContext, PublisherResult, PublisherStatus } from "../contracts/publisher.types";
export declare abstract class BasePublisher implements PublisherAdapter {
    abstract channel: string;
    health(): Promise<PublisherStatus>;
    publish(ctx: PublisherContext): Promise<PublisherResult>;
    private simulationOf;
}
