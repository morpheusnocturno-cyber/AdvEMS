import type { Request, Response } from 'express';
export declare function register(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function login(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function mfaSetup(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function mfaVerify(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=authController.d.ts.map