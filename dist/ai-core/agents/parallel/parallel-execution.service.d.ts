export declare class ParallelExecutionService {
    execute(tasks: any[]): Promise<{
        task: any;
        status: string;
    }[]>;
}
