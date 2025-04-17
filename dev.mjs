import fs from 'fs';
import https from 'https';
import os from 'os';
import path from 'path';
import url from 'url';

import next from 'next';


import './env.mjs';

const port = process.env.PORT || '3001';
const productHostUrl = process.env.PRODUCT_LOCALHOST_URL || 'www.local.wsj.com';
const app = next({ dev: true, port, quiet: false });

const homedir = os.homedir();

const requestHandler = app.getRequestHandler();

app.prepare().then(() => {
  // .consumer-certs needs to be generated using local-consumer-ssl-certs repo
  const server = https.createServer(
    {
      cert: fs.readFileSync(path.join(homedir, '.consumer-certs', 'consumer.crt')),
      key: fs.readFileSync(path.join(homedir, '.consumer-certs', 'consumer.key'))
    },
    async (req, res) => {
      const parsedUrl = url.parse(req.url, true);

      try {
        await requestHandler(req, res, parsedUrl);
        return;
      } catch (err) {
        console.log({ err });
        const { message, status = 500 } = err;

        return res.status(status).send(message);
      }
    }
  );

  server.listen({ port }, () => {
    console.log(`secure server listening on port: ${port}`);
    console.log(`*** https://${productHostUrl}:${port} ***`);
  });
});


