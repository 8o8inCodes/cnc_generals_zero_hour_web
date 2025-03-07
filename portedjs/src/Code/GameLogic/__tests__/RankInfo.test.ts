import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RankInfo, RankInfoStore, TheRankInfoStore } from '../RankInfo';

// Test helper to access private members
const getPrivateStore = (store: RankInfoStore): { m_rankInfos: RankInfo[] } => {
    return store as unknown as { m_rankInfos: RankInfo[] };
};

describe('RankInfo', () => {
    let rankInfo: RankInfo;

    beforeEach(() => {
        rankInfo = new RankInfo();
    });

    it('should initialize with default values', () => {
        expect(rankInfo.m_rankName).toBe('');
        expect(rankInfo.m_skillPointsNeeded).toBe(0);
        expect(rankInfo.m_sciencePurchasePointsGranted).toBe(0);
        expect(rankInfo.m_sciencesGranted).toEqual([]);
    });

    describe('override functionality', () => {
        it('should handle overrides correctly', () => {
            const override = new RankInfo();
            override.m_rankName = 'Override Rank';
            override.m_skillPointsNeeded = 100;
            
            rankInfo.setNextOverride(override);
            override.markAsOverride();

            expect(rankInfo.getFinalOverride()).toBe(override);
        });

        it('should return null when deleting overrides on an override', () => {
            const override = new RankInfo();
            override.markAsOverride();
            
            expect(override.deleteOverrides()).toBeNull();
        });

        it('should return self when deleting overrides on base object', () => {
            expect(rankInfo.deleteOverrides()).toBe(rankInfo);
        });
    });
});

describe('RankInfoStore', () => {
    let store: RankInfoStore;

    beforeEach(() => {
        store = new RankInfoStore();
    });

    describe('init', () => {
        it('should initialize empty store', () => {
            store.init();
            expect(store.getRankLevelCount()).toBe(0);
        });

        it('should assert if initializing non-empty store', () => {
            const consoleSpy = vi.spyOn(console, 'assert');
            
            // Add a rank to make store non-empty
            const rank = new RankInfo();
            getPrivateStore(store).m_rankInfos.push(rank);
            
            store.init();
            
            expect(consoleSpy).toHaveBeenCalledWith(false, "RankInfoStore already initialized");
        });
    });

    describe('reset', () => {
        it('should handle reset of empty store', () => {
            store.reset();
            expect(store.getRankLevelCount()).toBe(0);
        });

        it('should reset store with overrides', () => {
            const rank = new RankInfo();
            const override = new RankInfo();
            override.markAsOverride();
            rank.setNextOverride(override);
            
            getPrivateStore(store).m_rankInfos.push(rank);
            
            store.reset();
            
            // Original rank should remain, override should be removed
            expect(store.getRankLevelCount()).toBe(1);
        });

        it('should assert if base rank is marked as override', () => {
            const rank = new RankInfo();
            rank.markAsOverride();
            getPrivateStore(store).m_rankInfos.push(rank);
            
            const consoleSpy = vi.spyOn(console, 'assert');
            store.reset();
            
            expect(consoleSpy).toHaveBeenCalledWith(false, "Should not be possible for RankInfo");
            expect(store.getRankLevelCount()).toBe(0);
        });
    });

    describe('getRankInfo', () => {
        beforeEach(() => {
            // Setup test ranks
            const rank1 = new RankInfo();
            rank1.m_rankName = 'Rank 1';
            const rank2 = new RankInfo();
            rank2.m_rankName = 'Rank 2';
            
            getPrivateStore(store).m_rankInfos.push(rank1, rank2);
        });

        it('should return null for invalid rank level', () => {
            expect(store.getRankInfo(0)).toBeNull();
            expect(store.getRankInfo(3)).toBeNull();
        });

        it('should return rank info for valid level', () => {
            const rank = store.getRankInfo(1);
            expect(rank).toBeTruthy();
            expect(rank?.m_rankName).toBe('Rank 1');
        });

        it('should return final override if rank has overrides', () => {
            const override = new RankInfo();
            override.m_rankName = 'Rank 1 Override';
            override.markAsOverride();
            
            const privateStore = getPrivateStore(store);
            privateStore.m_rankInfos[0].setNextOverride(override);
            
            const rank = store.getRankInfo(1);
            expect(rank?.m_rankName).toBe('Rank 1 Override');
        });
    });
});

describe('TheRankInfoStore', () => {
    it('should be initialized as null', () => {
        expect(TheRankInfoStore).toBeNull();
    });
});