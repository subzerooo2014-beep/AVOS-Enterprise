export declare function buildWhere(search?: string, fields?: string[]): {
    OR?: undefined;
} | {
    OR: {
        [x: string]: {
            contains: string;
            mode: string;
        };
    }[];
};
