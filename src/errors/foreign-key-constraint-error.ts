import { CustomError } from './custom-error';

export class ForeignKeyConstraintError extends CustomError {
    readonly statusCode = 400;
    readonly reason: string = 'Foreign Key Constaint Error';

    constructor() {
        super();

        Object.setPrototypeOf(this, ForeignKeyConstraintError.prototype);
    }
}
