import { CustomError } from './custom-error';

export class ForeignKeyConstaintError extends CustomError {
    readonly statusCode = 400;
    readonly reason: string = 'Foreign Key Constaint Error';

    constructor() {
        super();

        Object.setPrototypeOf(this, ForeignKeyConstaintError.prototype);
    }
}
