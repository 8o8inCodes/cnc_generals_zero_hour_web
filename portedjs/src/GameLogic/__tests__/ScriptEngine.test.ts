import { describe, it, expect, beforeEach } from 'vitest';
import { ScriptEngine, SequentialScript, TheScriptEngine } from '../ScriptEngine';
import { Team } from '../../Common/Team';
import { Script } from '../Scripts';
import { GameObject } from '../../Code/GameLogic/GameObject';

describe('ScriptEngine', () => {
    beforeEach(() => {
        TheScriptEngine.reset();
    });

    describe('Singleton', () => {
        it('should return the same instance', () => {
            const instance1 = ScriptEngine.getInstance();
            const instance2 = ScriptEngine.getInstance();
            expect(instance1).toBe(instance2);
        });
    });

    describe('Sequential Scripts', () => {
        it('should append sequential script', () => {
            const script = new Script('test-id', 'test-script');
            const seqScript = new SequentialScript();
            seqScript.scriptToExecuteSequentially = script;
            
            TheScriptEngine.appendSequentialScript(seqScript);
            
            // Create a second script in sequence
            const seqScript2 = new SequentialScript();
            seqScript2.scriptToExecuteSequentially = script;
            TheScriptEngine.appendSequentialScript(seqScript2);
        });

        it('should handle object-based scripts', () => {
            const gameObject = new GameObject(1);
            const script = new Script('test-id', 'test-script');
            
            const seqScript = new SequentialScript();
            seqScript.objectID = gameObject.getID();
            seqScript.scriptToExecuteSequentially = script;
            
            TheScriptEngine.appendSequentialScript(seqScript);
            TheScriptEngine.setSequentialTimer(gameObject, 5);
            
            // Run update to decrease timer
            TheScriptEngine.update();
            
            // Remove scripts for object
            TheScriptEngine.removeAllSequentialScripts(gameObject);
        });

        it('should handle team-based scripts', () => {
            const team = new Team(1);
            const script = new Script('test-id', 'test-script');
            
            const seqScript = new SequentialScript();
            seqScript.teamToExecOn = team;
            seqScript.scriptToExecuteSequentially = script;
            
            TheScriptEngine.appendSequentialScript(seqScript);
            TheScriptEngine.setSequentialTimer(team, 3);
            
            // Run updates to decrease timer
            TheScriptEngine.update();
            TheScriptEngine.update();
            
            // Remove scripts for team
            TheScriptEngine.removeAllSequentialScripts(team);
        });

        it('should handle script loops', () => {
            const script = new Script('test-id', 'test-script');
            const seqScript = new SequentialScript();
            seqScript.scriptToExecuteSequentially = script;
            seqScript.timesToLoop = 2;
            seqScript.framesToWait = 1;
            
            TheScriptEngine.appendSequentialScript(seqScript);
            
            // First update - should decrease wait time
            TheScriptEngine.update();
            
            // Second update - should execute script and loop
            TheScriptEngine.update();
            
            // Third update - should execute final loop
            TheScriptEngine.update();
        });
    });

    describe('Game State', () => {
        it('should track object changes', () => {
            TheScriptEngine.notifyOfObjectCreationOrDestruction();
            expect(TheScriptEngine.getFrameObjectCountChanged()).toBeGreaterThan(0);
        });

        it('should handle game ending state', () => {
            expect(TheScriptEngine.isGameEnding()).toBe(false);
        });

        it('should handle difficulty bonus setting', () => {
            TheScriptEngine.setObjectsShouldReceiveDifficultyBonus(true);
            expect(TheScriptEngine.getObjectsShouldReceiveDifficultyBonus()).toBe(true);
        });

        it('should handle victim selection mode', () => {
            TheScriptEngine.setChooseVictimAlwaysUsesNormal(true);
            expect(TheScriptEngine.getChooseVictimAlwaysUsesNormal()).toBe(true);
        });
    });
});