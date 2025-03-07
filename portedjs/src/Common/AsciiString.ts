/**
 * A class representing an ASCII string, ported from the original C++ code
 */
export class AsciiString {
  private value: string;

  constructor(str: string = '') {
    this.value = str;
  }

  toString(): string {
    return this.value;
  }

  equals(other: AsciiString): boolean {
    return this.value === other.value;
  }

  clear(): void {
    this.value = '';
  }

  static readonly TheEmptyString = new AsciiString('');
}