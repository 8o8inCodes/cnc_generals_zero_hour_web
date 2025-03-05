import { SubsystemInterface } from './SubsystemInterface';

export interface NetworkPacket {
    data: ArrayBuffer;
    size: number;
    timestamp: number;
}

export interface NetworkInterface extends SubsystemInterface {
    update(): void;
    isFrameDataReady(): boolean;
    isConnected(): boolean;
    sendPacket(packet: NetworkPacket): void;
    receivePacket(): NetworkPacket | null;
    getLatency(): number;
    getConnectionQuality(): number;
    disconnect(): void;
}