import { CustomError } from './custom-error';

export class UniqueKeyConstraintError extends CustomError {
    readonly statusCode = 400;
    readonly reason: string = 'Unique Key Constaint Error';

    constructor() {
        super();

        Object.setPrototypeOf(this, UniqueKeyConstraintError.prototype);
    }
}
