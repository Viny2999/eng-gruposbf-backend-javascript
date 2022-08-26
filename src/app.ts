import { Routes } from './controllers';
import express, { Request, Response } from 'express';
import { NOT_FOUND } from './utils/errors.json';
import { LoggerService } from './services';
import * as dotenv from 'dotenv';
dotenv.config();

const logger = LoggerService.getLogger();

const app: express.Application = express();
const port = process.env.PORT || 8080;
const host = process.env.HOST || 'localhost';

app.use('/v1', Routes);

app.use((req: Request, res: Response) => res.status(404).send(NOT_FOUND));

app.listen(port, () =>
  logger.info(`The Web Server is Listening at http://${host}:${port}`)
);

export const App: express.Application = app;
