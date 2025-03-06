import { ObjectID } from './ObjectID';
import { BitFlags } from '../Common/BitFlags';
import { ObjectStatus } from '../Common/ObjectStatus';

export class GameObject {
    private id: ObjectID;
    private statusBits: BitFlags<ObjectStatus>;

    constructor(id: ObjectID) {
        this.id = id;
        this.statusBits = new BitFlags<ObjectStatus>();
    }

    public getID(): ObjectID {
        return this.id;
    }

    public getStatusBits(): BitFlags<ObjectStatus> {
        return this.statusBits;
    }
}