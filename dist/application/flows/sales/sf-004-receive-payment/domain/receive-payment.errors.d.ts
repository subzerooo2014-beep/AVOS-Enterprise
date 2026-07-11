import { BadRequestException, NotFoundException } from "@nestjs/common";
export declare class InvoiceNotFoundException extends NotFoundException {
    constructor();
}
export declare class InvoiceAlreadyPaidException extends BadRequestException {
    constructor();
}
export declare class InvalidPaymentAmountException extends BadRequestException {
    constructor();
}
