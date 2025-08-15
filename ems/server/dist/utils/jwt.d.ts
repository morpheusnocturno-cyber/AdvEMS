import type { Role } from '@prisma/client';
export declare const signToken: (userId: string, role: Role, opts?: {
    mfa?: boolean;
    expiresInSeconds?: number;
}) => string;
//# sourceMappingURL=jwt.d.ts.map