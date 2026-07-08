export declare function buildSearchFilter(search?: string, fields?: string[]): {
    OR: {
        [x: string]: {
            contains: string;
            mode: string;
        };
    }[];
} | undefined;
