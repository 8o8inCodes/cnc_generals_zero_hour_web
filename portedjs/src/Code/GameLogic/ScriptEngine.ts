import { Team } from '../../Common/Team';
import { ObjectID } from '../../interfaces/ObjectID';
import { GameObject } from './GameObject';
import { Script } from './Scripts';

/**
 * Represents a script that can be executed sequentially
 */
export class SequentialScript {
    teamToExecOn: Team | null = null;
    objectID: ObjectID = -1; // INVALID_ID
    scriptToExecuteSequentially: Script | null = null;
    currentInstruction: number = 0; // START_INSTRUCTION
    timesToLoop: number = 0;
    framesToWait: number = -1;
    dontAdvanceInstruction: boolean = false;
    nextScriptInSequence: SequentialScript | null = null;

    constructor() {
        // Initialize with default values
    }
}

type ScriptTarget = GameObject | Team;

/**
 * Implementation for the Script Engine singleton
 */
export class ScriptEngine {
    private sequentialScripts: SequentialScript[] = [];
    private static instance: ScriptEngine;
    private frameObjectCountChanged: number = 0;
    private endGameTimer: number = -1;
    private objectsShouldReceiveDifficultyBonus: boolean = false;
    private chooseVictimAlwaysUsesNormal: boolean = false;

    private constructor() {
        // Private constructor for singleton
    }

    static getInstance(): ScriptEngine {
        if (!ScriptEngine.instance) {
            ScriptEngine.instance = new ScriptEngine();
        }
        return ScriptEngine.instance;
    }

    init(): void {
        this.reset();
    }

    reset(): void {
        this.sequentialScripts = [];
        this.frameObjectCountChanged = 0;
        this.endGameTimer = -1;
    }

    update(): void {
        this.evaluateAndProgressAllSequentialScripts();
    }

    appendSequentialScript(scriptToSequence: SequentialScript): void {
        let found = false;

        // Look for existing sequence for this object/team
        for (const seqScript of this.sequentialScripts) {
            if ((scriptToSequence.objectID !== -1 && scriptToSequence.objectID === seqScript.objectID) ||
                (scriptToSequence.teamToExecOn && scriptToSequence.teamToExecOn === seqScript.teamToExecOn)) {
                found = true;
                
                // Find end of sequence
                let current = seqScript;
                while (current.nextScriptInSequence) {
                    current = current.nextScriptInSequence;
                }
                current.nextScriptInSequence = scriptToSequence;
                break;
            }
        }

        if (!found) {
            this.sequentialScripts.push(scriptToSequence);
        }
    }

    removeSequentialScript(scriptToRemove: SequentialScript): void {
        const index = this.sequentialScripts.indexOf(scriptToRemove);
        if (index > -1) {
            this.sequentialScripts.splice(index, 1);
        }
    }

    removeAllSequentialScripts(target: ScriptTarget): void {
        if (target instanceof GameObject) {
            const id = target.getID();
            this.sequentialScripts = this.sequentialScripts.filter(script => script.objectID !== id);
        } else {
            this.sequentialScripts = this.sequentialScripts.filter(script => script.teamToExecOn !== target);
        }
    }

    notifyOfObjectCreationOrDestruction(): void {
        this.frameObjectCountChanged = Date.now(); // Use timestamp instead of frame count for now
    }

    notifyOfTeamDestruction(teamDestroyed: Team): void {
        this.removeAllSequentialScripts(teamDestroyed);
    }

    setSequentialTimer(target: ScriptTarget, frameCount: number): void {
        let scripts: SequentialScript[];
        
        if (target instanceof GameObject) {
            scripts = this.sequentialScripts.filter(s => s.objectID === target.getID());
        } else {
            scripts = this.sequentialScripts.filter(s => s.teamToExecOn === target);
        }

        for (const script of scripts) {
            script.framesToWait = frameCount;
        }
    }

    private evaluateAndProgressAllSequentialScripts(): void {
        for (let i = 0; i < this.sequentialScripts.length; i++) {
            const seqScript = this.sequentialScripts[i];
            
            if (!seqScript.dontAdvanceInstruction) {
                if (seqScript.framesToWait <= 0) {
                    // Execute script logic here
                    if (seqScript.scriptToExecuteSequentially) {
                        seqScript.scriptToExecuteSequentially.execute(
                            seqScript.objectID !== -1 ? seqScript.objectID : null,
                            seqScript.teamToExecOn
                        );
                    }

                    // Reset or remove script based on loop count
                    if (seqScript.timesToLoop !== 0) {
                        if (seqScript.timesToLoop !== -1) {
                            seqScript.timesToLoop--;
                        }
                        seqScript.framesToWait = -1;
                        this.appendSequentialScript(seqScript);
                    }
                    
                    // Move to next script in sequence
                    if (seqScript.nextScriptInSequence) {
                        this.sequentialScripts[i] = seqScript.nextScriptInSequence;
                    } else {
                        this.sequentialScripts.splice(i, 1);
                        i--;
                    }
                } else {
                    seqScript.framesToWait--;
                }
            }
        }
    }

    // Utility methods
    getFrameObjectCountChanged(): number {
        return this.frameObjectCountChanged;
    }

    isGameEnding(): boolean {
        return this.endGameTimer >= 0;
    }

    setObjectsShouldReceiveDifficultyBonus(receive: boolean): void {
        this.objectsShouldReceiveDifficultyBonus = receive;
    }

    getObjectsShouldReceiveDifficultyBonus(): boolean {
        return this.objectsShouldReceiveDifficultyBonus;
    }

    setChooseVictimAlwaysUsesNormal(value: boolean): void {
        this.chooseVictimAlwaysUsesNormal = value;
    }

    getChooseVictimAlwaysUsesNormal(): boolean {
        return this.chooseVictimAlwaysUsesNormal;
    }
}

// Export singleton instance
export const TheScriptEngine = ScriptEngine.getInstance();