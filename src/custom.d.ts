declare namespace Express {
    interface Request {
        session: {
            userId: string | undefined;
            destroy: function;
        } | null;
    }
}
