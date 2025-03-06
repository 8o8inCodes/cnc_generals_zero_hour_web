import { GameObject } from '../GameLogic/GameObject';

/**
 * Base class for all game things (objects, effects, etc)
 */
export class Thing {
    protected gameObject: GameObject;

    constructor(gameObject: GameObject) {
        this.gameObject = gameObject;
    }

    public getObject(): GameObject {
        return this.gameObject;
    }
}