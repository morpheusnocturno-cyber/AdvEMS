export declare function getOpenAttendance(userId: string): Promise<{
    id: string;
    createdAt: Date;
    userId: string;
    clockIn: Date;
    clockOut: Date | null;
    latitude: number | null;
    longitude: number | null;
} | null>;
export declare function clockIn(userId: string, coords?: {
    latitude?: number;
    longitude?: number;
}): Promise<{
    id: string;
    createdAt: Date;
    userId: string;
    clockIn: Date;
    clockOut: Date | null;
    latitude: number | null;
    longitude: number | null;
}>;
export declare function clockOut(userId: string, coords?: {
    latitude?: number;
    longitude?: number;
}): Promise<{
    id: string;
    createdAt: Date;
    userId: string;
    clockIn: Date;
    clockOut: Date | null;
    latitude: number | null;
    longitude: number | null;
}>;
export declare function listMyAttendance(userId: string, days?: number): Promise<{
    id: string;
    createdAt: Date;
    userId: string;
    clockIn: Date;
    clockOut: Date | null;
    latitude: number | null;
    longitude: number | null;
}[]>;
//# sourceMappingURL=attendanceService.d.ts.map