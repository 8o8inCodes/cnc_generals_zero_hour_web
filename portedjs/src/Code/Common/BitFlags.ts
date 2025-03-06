/**
 * BitFlags class for managing bitwise flags
 */
export class BitFlags<T extends number> {
    private flags: number;

    constructor() {
        this.flags = 0;
    }

    public set(flag: T, value: number): void {
        if (value) {
            this.flags |= (1 << flag);
        } else {
            this.flags &= ~(1 << flag);
        }
    }

    public test(flag: T): boolean {
        return (this.flags & (1 << flag)) !== 0;
    }

    public clear(): void {
        this.flags = 0;
    }

    public getFlags(): number {
        return this.flags;
    }
}