import jwt from "jsonwebtoken";
export declare class JwtService {
    static sign(payload: any): string;
    static verify(token: string): string | jwt.JwtPayload;
}
