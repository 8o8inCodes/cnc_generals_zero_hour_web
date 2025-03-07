import { ObjectID } from '../../interfaces/ObjectID';
import { Team } from '../../Common/Team';

/**
 * Represents a game script that can be executed
 */
export class Script {
    private id: string;
    private name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    execute(objectId: ObjectID | null = null, team: Team | null = null): void {
        // Script execution logic will be implemented here
    }
}