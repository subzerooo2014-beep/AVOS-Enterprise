export declare function createCrmActivity(type: string, description: string, payload?: any): {
    id: string;
    type: string;
    description: string;
    payload: any;
    createdAt: string;
};
export declare function appendCrmActivity(record: any, activity: any): any[];
