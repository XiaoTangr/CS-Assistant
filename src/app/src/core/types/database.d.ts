export interface DBResult {
    /** Number of rows affected*/
    rowsAffected: number;
    /** Last insert id*/
    lastInsertId?: number | undefined;
}

export interface keyValue {
    key: string;
    value: string;
}