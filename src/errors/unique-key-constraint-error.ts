import { CustomError } from './custom-error';

export class UniqueKeyConstaintError extends CustomError {
    readonly statusCode = 400;
    readonly reason: string = 'Unique Key Constaint Error';

    constructor() {
        super();

        Object.setPrototypeOf(this, UniqueKeyConstaintError.prototype);
    }
}
