import express from 'express';

export class Status {
    status : number

    constructor(status : number) {
        this.status = status;
    }
}

const statusHandler = (response: Status, req : express.Request, res: express.Response, next : express.NextFunction) => {

    res.status(response.status);

    next();
}

export default statusHandler;
