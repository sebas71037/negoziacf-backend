import 'reflect-metadata';
import 'module-alias/register';
import * as express from 'express';
import * as os from 'os';
import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { createConnection } from 'typeorm';

import { RoutesConf } from './config/routes.conf';
import { CorsConf } from './config/cords.conf';
import { Routes } from './routes/index';

dotenv.config();

const app = express();
const ssl = process.env.SSL_STATUS || 'false';
const PORT = process.env.PORT || 3331;

CorsConf.init(app);
RoutesConf.init(app);
Routes.init(app);

let server: any;
if (ssl === 'true') {
  const key = process.env.SSL_KEY || './certs/DELETE-ME';
  const crt = process.env.SSL_CERT || './certs/DELETE-ME';
  const ca = process.env.SSL_CA || './certs/DELETE-ME';

  const opts = {
    key: fs.readFileSync(key),
    cert: fs.readFileSync(crt),
    ca: fs.readFileSync(ca),
  };
  server = https.createServer(opts, app);
}else {
  server = http.createServer(app);
}

export default server;

createConnection()
  .then(async (connection) => {
    await connection.runMigrations();
    server.listen(PORT, () => {
      console.log(`up and running @: ${os.hostname()} on port: ${PORT}`);
      console.log(`enviroment: ${process.env.NODE_ENV}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
