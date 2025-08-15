import type { Request, Response, NextFunction } from 'express';
import type { Role } from '@prisma/client';
export interface AuthTokenPayload {
    sub: string;
    role: Role;
    mfa?: boolean;
}
export declare const authenticate: (requireFullAuth?: boolean) => (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const requireRoles: (roles: Role[]) => (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
//# sourceMappingURL=auth.d.ts.map