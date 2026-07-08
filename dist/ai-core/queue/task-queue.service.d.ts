export declare class TaskQueueService {
    private queue;
    push(task: any): number;
    pop(): any;
    size(): number;
}
