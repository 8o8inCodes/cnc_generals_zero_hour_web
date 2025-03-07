/*
**	Command & Conquer Generals(tm)
**	Copyright 2025 Electronic Arts Inc.
*/

import { Overridable } from './CrateSystem';

/**
 * Represents information about a player rank, including name, required skill points,
 * and granted sciences/abilities
 */
export class RankInfo extends Overridable {
    m_rankName: string = '';
    m_skillPointsNeeded: number = 0;
    m_sciencePurchasePointsGranted: number = 0;
    m_sciencesGranted: number[] = []; // Using number[] for now as ScienceType enum replacement

    getFinalOverride(): RankInfo {
        const nextOverride = this.nextOverride as RankInfo;
        return nextOverride ? nextOverride : this;
    }

    deleteOverrides(): RankInfo | null {
        const override = super.deleteOverrides();
        return override ? override as RankInfo : null;
    }
}

/**
 * Manages a collection of RankInfo objects and provides methods to access them
 */
export class RankInfoStore {
    private m_rankInfos: RankInfo[] = [];
    
    init(): void {
        if (this.m_rankInfos.length > 0) {
            console.assert(false, "RankInfoStore already initialized");
        }
        this.m_rankInfos = [];
    }

    reset(): void {
        for (let i = 0; i < this.m_rankInfos.length; i++) {
            const ri = this.m_rankInfos[i];
            if (ri) {
                const temp = ri.deleteOverrides();
                if (!temp) {
                    console.assert(false, "Should not be possible for RankInfo");
                    this.m_rankInfos.splice(i, 1);
                    i--; // Adjust index since we removed an element
                }
            }
        }
    }

    getRankLevelCount(): number {
        return this.m_rankInfos.length;
    }

    /**
     * Get rank info for a specific level
     * @param level Level number (1-based, not 0-based)
     * @returns The RankInfo object for the specified level or null if invalid
     */
    getRankInfo(level: number): RankInfo | null {
        if (level >= 1 && level <= this.getRankLevelCount()) {
            const ri = this.m_rankInfos[level - 1];
            if (ri) {
                return ri.getFinalOverride();
            }
        }
        return null;
    }
}

// Global instance of RankInfoStore
export const TheRankInfoStore: RankInfoStore | null = null;