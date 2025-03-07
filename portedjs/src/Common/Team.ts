/**
 * Represents a team in the game
 */
export class Team {
    private id: number;
    
    constructor(id: number) {
        this.id = id;
    }

    getID(): number {
        return this.id;
    }
}