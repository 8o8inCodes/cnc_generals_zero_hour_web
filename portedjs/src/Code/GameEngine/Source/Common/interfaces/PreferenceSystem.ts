export interface PreferenceSystem {
    load(filename: string): void;
    save(): void;
    write(): void;
    getInt(key: string, defaultValue: number): number;
    getString(key: string, defaultValue: string): string;
    getBoolean(key: string, defaultValue: boolean): boolean;
    setInt(key: string, value: number): void;
    setString(key: string, value: string): void;
    setBoolean(key: string, value: boolean): void;
}