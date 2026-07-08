export declare function createCrmTimelineEvent(type: string, payload?: any): {
    type: string;
    payload: any;
    createdAt: string;
};
export declare function appendCrmTimeline(record: any, event: any): any[];
