import { Team } from '../../../Common/Team';

/**
 * Interface for cave entrance module functionality
 */
export interface CaveInterface {
    setOriginalTeam(oldTeam: Team | null): void;
    tryToSetCaveIndex(newIndex: number): void;
}