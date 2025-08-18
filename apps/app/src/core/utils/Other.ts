/**
 * 版本比较器
 * @param val1 版本字符串 a
 * @param val2 版本字符串 b
 * @returns 1: val1 > val2
 * @returns 0: val1 = val2
 * @returns -1: val1 < val2
 * @example versionComparator('1.2.0', '1.0.1') = 1
 */
export function versionComparator(val1: string, val2: string): number {
    val1 = val1.replace(/^v/, '');
    val2 = val2.replace(/^v/, '');
    const aParts = val1.split('.').map(Number);
    const bParts = val2.split('.').map(Number);

    const maxLength = Math.max(aParts.length, bParts.length);
    for (let i = 0; i < maxLength; i++) {
        const aPart = aParts[i] || 0;
        const bPart = bParts[i] || 0;

        if (aPart < bPart) return -1;
        if (aPart > bPart) return 1;
    }
    return 0;
}
