import { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
export declare class PlatformExceptionFilter implements ExceptionFilter {
    private readonly logger;
    catch(exception: unknown, host: ArgumentsHost): void;
    private statusCode;
    private details;
    private prismaMessage;
    private httpCode;
    private isProduction;
}
