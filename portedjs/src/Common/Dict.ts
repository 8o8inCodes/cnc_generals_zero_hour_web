import { AsciiString } from './AsciiString';

/**
 * A dictionary class for storing key-value pairs
 */
export class Dict {
  private data: Map<string, string | number | boolean> = new Map();

  setString(key: string, value: string): void {
    this.data.set(key, value);
  }

  getString(key: string): string {
    const value = this.data.get(key);
    return typeof value === 'string' ? value : '';
  }

  getAsciiString(key: string): AsciiString {
    return new AsciiString(this.getString(key));
  }

  clear(): void {
    this.data.clear();
  }

  clone(): Dict {
    const newDict = new Dict();
    this.data.forEach((value, key) => {
      newDict.data.set(key, value);
    });
    return newDict;
  }
}