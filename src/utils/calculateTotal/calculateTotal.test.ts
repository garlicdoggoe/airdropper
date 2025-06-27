import { describe, it, expect } from 'vitest';
import { calculateTotal } from './calculateTotal';

describe('calculateTotal', () => {
  it('should return 0 for empty string', () => {
    expect(calculateTotal('')).toBe(0);
    expect(calculateTotal('   ')).toBe(0);
  });

  it('should handle single number input', () => {
    expect(calculateTotal('5')).toBe(5);
    expect(calculateTotal('10.5')).toBe(10.5);
  });

  it('should sum multiple numbers separated by commas', () => {
    expect(calculateTotal('1,2,3')).toBe(6);
    expect(calculateTotal('10.5,20.3,30.2')).toBe(61);
  });

  it('should sum multiple numbers separated by newlines', () => {
    expect(calculateTotal('1\n2\n3')).toBe(6);
    expect(calculateTotal('10.5\n20.3\n30.2')).toBe(61);
  });

  it('should handle mixed comma and newline separators', () => {
    expect(calculateTotal('1\n2,3')).toBe(6);
    expect(calculateTotal('10.5,20.3\n30.2')).toBe(61);
  });

  it('should ignore invalid numbers and whitespace', () => {
    expect(calculateTotal('1,abc,2')).toBe(3);
    expect(calculateTotal('  1  ,  2  ,  3  ')).toBe(6);
    expect(calculateTotal('1,\n,2,,,3')).toBe(6);
    expect(calculateTotal('12three\n45')).toBe(57);
  });
});
