import { SubsystemInterface } from '../interfaces/SubsystemInterface';
import { GameFont } from './GameFont';
import { Color } from './Color';
import { View } from './View';
import { DisplayString } from './DisplayString';
import { AsciiString } from '../Common/AsciiString';

export interface DisplaySettings {
  xRes: number;    // Resolution width
  yRes: number;    // Resolution height 
  bitDepth: number; // Color depth
  windowed: boolean; // Window mode
}

export enum DrawImageMode {
  DRAW_IMAGE_SOLID,
  DRAW_IMAGE_GRAYSCALE,   // Draw image without blending and ignoring alpha
  DRAW_IMAGE_ALPHA,       // Alpha blend the image into frame buffer
  DRAW_IMAGE_ADDITIVE     // Additive blend the image into frame buffer
}

export type DebugDisplayCallback = (debugDisplay: any, userData: any, fp?: any) => void;

export class Display implements SubsystemInterface {
  private static _instance: Display;
  
  private viewList: View | null;
  private width: number;
  private height: number;
  private bitDepth: number;
  private windowed: boolean;
  private debugDisplayCallback: DebugDisplayCallback | null;
  private debugDisplayUserData: any;
  private debugDisplay: any;
  private letterBoxFadeLevel: number;
  private letterBoxEnabled: boolean;
  private cinematicText: AsciiString;
  private cinematicFont: GameFont | null;
  private cinematicTextFrames: number;
  private movieHoldTime: number;
  private copyrightHoldTime: number;
  private elapsedMovieTime: number;
  private elapsedCopyrightTime: number;
  private copyrightDisplayString: DisplayString | null;

  private constructor() {
    this.viewList = null;
    this.width = 0;
    this.height = 0;
    this.bitDepth = 0;
    this.windowed = false;
    this.debugDisplayCallback = null;
    this.debugDisplayUserData = null;
    this.debugDisplay = null;
    this.letterBoxFadeLevel = 0;
    this.letterBoxEnabled = false;
    this.cinematicText = new AsciiString("");
    this.cinematicFont = null;
    this.cinematicTextFrames = 0;
    this.movieHoldTime = -1;
    this.copyrightHoldTime = -1;
    this.elapsedMovieTime = 0;
    this.elapsedCopyrightTime = 0;
    this.copyrightDisplayString = null;
  }

  public static getInstance(): Display {
    if (!Display._instance) {
      Display._instance = new Display();
    }
    return Display._instance;
  }

  public init(): void {
    // Initialize display subsystem
  }

  public reset(): void {
    // Reset display state
  }

  public update(): void {
    // Update display state
  }

  public setWidth(width: number): void {
    this.width = width;
    // Update mouse limits if mouse system exists
  }

  public setHeight(height: number): void {
    this.height = height;
    // Update mouse limits if mouse system exists
  }

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }

  public getBitDepth(): number {
    return this.bitDepth;
  }

  public getWindowed(): boolean {
    return this.windowed;
  }

  public setDisplayMode(xres: number, yres: number, bitDepth: number, windowed: boolean): boolean {
    const oldWidth = this.width;
    const oldHeight = this.height;

    this.width = xres;
    this.height = yres;
    this.bitDepth = bitDepth;
    this.windowed = windowed;

    // TODO: Handle view resizing and mouse limit updates

    return true;
  }

  public setDebugDisplayCallback(callback: DebugDisplayCallback | null, userData: any = null): void {
    this.debugDisplayCallback = callback;
    this.debugDisplayUserData = userData;
  }

  public getDebugDisplayCallback(): DebugDisplayCallback | null {
    return this.debugDisplayCallback;
  }

  public draw(): void {
    // Draw current frame
    if (this.debugDisplayCallback) {
      this.drawCurrentDebugDisplay();
    }

    // Handle cinematic text display if active
    if (this.cinematicText.length() > 0 && this.cinematicTextFrames > 0) {
      this.drawCinematicText();
    }

    // Draw letterbox if enabled
    if (this.letterBoxEnabled) {
      this.renderLetterBox();
    }
  }

  private drawCurrentDebugDisplay(): void {
    if (this.debugDisplay && this.debugDisplayCallback) {
      this.debugDisplay.reset();
      this.debugDisplayCallback(this.debugDisplay, this.debugDisplayUserData);
    }
  }

  private drawCinematicText(): void {
    // Draw cinematic text overlay
    this.cinematicTextFrames--;
  }

  private renderLetterBox(): void {
    // Draw letterbox borders
  }
}

// Export singleton instance
export const TheDisplay: Display = Display.getInstance();