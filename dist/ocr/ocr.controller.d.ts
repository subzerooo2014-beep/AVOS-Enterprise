import { OcrService } from "./ocr.service";
export declare class OcrController {
    private service;
    constructor(service: OcrService);
    findAll(): never[];
    create(dto: any): any;
    update(id: string, dto: any): any;
    remove(id: string): {
        id: string;
        deleted: boolean;
    };
}
