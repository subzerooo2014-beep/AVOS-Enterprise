import { BadRequestException, NotFoundException } from "@nestjs/common";
export declare class QuoteNotFoundException extends NotFoundException {
    constructor();
}
export declare class QuoteCustomerMissingException extends BadRequestException {
    constructor();
}
export declare class QuoteAlreadyConvertedException extends BadRequestException {
    constructor();
}
export declare class QuoteNotConvertibleException extends BadRequestException {
    constructor();
}
