import { BadRequestException, NotFoundException } from "@nestjs/common";
export declare class OrderNotFoundException extends NotFoundException {
    constructor();
}
export declare class OrderAlreadyInvoicedException extends BadRequestException {
    constructor();
}
export declare class OrderNotInvoiceableException extends BadRequestException {
    constructor();
}
