export abstract class CustomError extends Error {
    abstract statusCode: number;
    abstract reason: string;

    constructor(message?: string) {
        super(message);

        Object.setPrototypeOf(this, CustomError.prototype);
    }
}
