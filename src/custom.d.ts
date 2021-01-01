declare namespace Express {
    interface Request {
        session: {
            userId: string;
        };
    }
}
