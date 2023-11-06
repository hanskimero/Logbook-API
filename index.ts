import express from 'express';
import path from 'path';
import apiLogRouter from './routes/apiLog';
import errorHandler from './errors/errorhandler';

const app : express.Application = express();

const port : number = Number(process.env.PORT) || 3104;

app.use(express.static(path.resolve(__dirname, "public")));

app.use("/api/log", apiLogRouter);

app.use(errorHandler);

app.use((req : express.Request, res : express.Response, next : express.NextFunction) => {

    if (!res.headersSent) {
        res.status(404).json({ message : "Faulty route"});
    }

    next();
});

app.listen(port, () => {

    console.log(`Server running in port : ${port}`);    

});





