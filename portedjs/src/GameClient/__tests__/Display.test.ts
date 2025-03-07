import { describe, it, expect, beforeEach } from 'vitest';
import { Display, TheDisplay, DrawImageMode, DisplaySettings } from '../Display';

describe('Display', () => {
  beforeEach(() => {
    // Reset any static state between tests
    // @ts-ignore - Accessing private static for testing
    Display['instance'] = null;
  });

  it('should be a singleton', () => {
    const display1 = Display.getInstance();
    const display2 = Display.getInstance();
    expect(display1).toBe(display2);
    expect(TheDisplay).toBe(display1);
  });

  it('should initialize with default values', () => {
    const display = Display.getInstance();
    expect(display.getWidth()).toBe(0);
    expect(display.getHeight()).toBe(0);
    expect(display.getBitDepth()).toBe(0);
    expect(display.getWindowed()).toBe(false);
  });

  it('should update display mode', () => {
    const display = Display.getInstance();
    const result = display.setDisplayMode(1920, 1080, 32, true);
    
    expect(result).toBe(true);
    expect(display.getWidth()).toBe(1920);
    expect(display.getHeight()).toBe(1080);
    expect(display.getBitDepth()).toBe(32);
    expect(display.getWindowed()).toBe(true);
  });

  it('should handle debug display callbacks', () => {
    const display = Display.getInstance();
    const mockCallback = vi.fn();
    const mockUserData = { test: 'data' };

    display.setDebugDisplayCallback(mockCallback, mockUserData);
    expect(display.getDebugDisplayCallback()).toBe(mockCallback);

    display.setDebugDisplayCallback(null);
    expect(display.getDebugDisplayCallback()).toBeNull();
  });

  it('should implement SubsystemInterface', () => {
    const display = Display.getInstance();
    expect(typeof display.init).toBe('function');
    expect(typeof display.reset).toBe('function');
    expect(typeof display.update).toBe('function');
  });
});