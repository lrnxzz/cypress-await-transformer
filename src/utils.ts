export function throwErrorIf(condition: boolean, message: string): void {
    if (condition) {
        throw new Error(message);
    }
}