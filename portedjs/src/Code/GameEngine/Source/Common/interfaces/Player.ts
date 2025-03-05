export interface PlayerTemplate {
    getName(): string;
    getId(): number;
}

export interface Player {
    getId(): number;
    getName(): string;
    getTeam(): number;
    isLocalPlayer(): boolean;
    getPlayerTemplate(): PlayerTemplate;
    update(deltaTime: number): void;
    reset(): void;
}

export interface PlayerList extends SubsystemInterface {
    addPlayer(player: Player): void;
    removePlayer(player: Player): void;
    getLocalPlayer(): Player;
    getPlayerById(id: number): Player | null;
    getPlayerByName(name: string): Player | null;
    getAllPlayers(): Player[];
}