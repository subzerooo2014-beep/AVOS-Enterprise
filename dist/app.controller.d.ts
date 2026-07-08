import { AppService } from "./app.service";
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    health(): {
        name: string;
        status: string;
        api: string;
    };
}
