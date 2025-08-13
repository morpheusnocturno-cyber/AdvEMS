import type { Role } from '@prisma/client';
export declare function registerUser(params: {
    email: string;
    password: string;
    name: string;
    role?: Role;
}): Promise<{
    id: string;
    email: string;
    name: string;
    role: import(".prisma/client").$Enums.Role;
}>;
export declare function authenticateUser(params: {
    email: string;
    password: string;
}): Promise<{
    mfaRequired: true;
    tempToken: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
    };
    token?: never;
} | {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
    };
    mfaRequired?: never;
    tempToken?: never;
}>;
export declare function setupMfa(userId: string): Promise<{
    otpauthUrl: string;
    base32: string;
}>;
export declare function verifyMfaAndIssueToken(params: {
    userId: string;
    token: string;
}): Promise<{
    token: string;
}>;
//# sourceMappingURL=userService.d.ts.map