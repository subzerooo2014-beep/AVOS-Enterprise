import { TasksService } from "./tasks.service";
export declare class TasksController {
    private service;
    constructor(service: TasksService);
    findAll(): any;
    create(dto: any): any;
}
