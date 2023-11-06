import express from 'express';
import { ErrorSpecified } from '../errors/errorhandler';
import { PrismaClient } from '@prisma/client';
import { Status } from '../errors/statushandler';

const prisma : PrismaClient = new PrismaClient();

const apiLogRouter : express.Router = express.Router();

apiLogRouter.use(express.json());

apiLogRouter.delete("/:id", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

    if (await prisma.log.count({
        where : {
            id : Number(req.params.id)
        }
    })) {
        try {

            const deletedData = await prisma.log.findUnique({
                where: {
                    id : Number(req.params.id)
                }
            });

            await prisma.log.delete({
                where : {
                    id : Number(req.params.id)
                }
            });

            res.json(deletedData);

            next(new Status(200));          

        } catch (e : any) {
            next(new ErrorSpecified())
        } 
    } else {
        next(new ErrorSpecified(404, "Faulty id"));
    }
});

apiLogRouter.post("/", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

    if (req.body.route?.length > 0 && req.body.km !== undefined && req.body.userId !==undefined) {

        try {

            const currentDate = new Date();
            const dayNumber = currentDate.getDate();
            const monthNumber = currentDate.getMonth() + 1;
            const yearNumber = currentDate.getFullYear();


            await prisma.log.create({
                data : {
                    route : req.body.route,
                    km : req.body.km,
                    userId : req.body.userId,
                    date : req.body.date ? req.body.date : `${dayNumber}.${monthNumber}.${yearNumber}`
            }
            });
           
            res.json(await prisma.log.findFirst({
                orderBy: {
                    id : 'desc'
                }
            }));
            
            next(new Status(200));

        } catch (e : any) {
            next(new ErrorSpecified())
        }
    } else {
        next(new ErrorSpecified(400, "Bad request body"))
    }
})

apiLogRouter.put("/:id", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

    if(await prisma.log.count({
        where : {
            id : Number(req.params.id)
        }
        })) {
            if (req.body.route?.length > 0 && req.body.km !== undefined && req.body.userId !==undefined) {

                try {

                    const currentDate = new Date();
                    const dayNumber = currentDate.getDate();
                    const monthNumber = currentDate.getMonth() + 1;
                    const yearNumber = currentDate.getFullYear();

                    await prisma.log.update({
                        where : {
                            id : Number(req.params.id)
                        },
                        data : {
                            route : req.body.route,
                            km : req.body.km,
                            userId : req.body.userId,
                            date : req.body.date ? req.body.date : `${dayNumber}.${monthNumber}.${yearNumber}`
                        }
                    });

                    res.json(await prisma.log.findUnique({
                        where : {
                            id : Number(req.params.id)
                        }
                    }))

                    next(new Status(200));

                } catch (e : any) {
                    next(new ErrorSpecified());
                }

            } else {
                next(new ErrorSpecified(400, "Faulty request body"));
            }
    } else {
        next(new ErrorSpecified(404, "Faulty id"));
    }

})


export default apiLogRouter;