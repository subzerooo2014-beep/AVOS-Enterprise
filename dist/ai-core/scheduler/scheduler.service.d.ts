export declare class SchedulerService {
    schedule(task: any, runAt: Date): {
        id: `${string}-${string}-${string}-${string}-${string}`;
        runAt: Date;
        task: any;
        status: string;
    };
}
