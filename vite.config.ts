import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'local-api-chat-middleware',
        configureServer(server) {
          server.middlewares.use('/api/chat', async (req, res) => {
            if (req.method === 'OPTIONS') {
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
              res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
              res.statusCode = 200;
              res.end();
              return;
            }

            if (req.method === 'POST') {
              let rawBody = '';
              req.on('data', (chunk) => {
                rawBody += chunk;
              });
              req.on('end', async () => {
                let parsedBody = {};
                try {
                  parsedBody = JSON.parse(rawBody || '{}');
                } catch {
                  parsedBody = {};
                }

                // Ensure env variable is passed
                process.env.GEMINI_API_KEY =
                  process.env.GEMINI_API_KEY || env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY;

                try {
                  const module = await server.ssrLoadModule('/api/chat.ts');
                  const handler = module.default;

                  const customReq = {
                    ...req,
                    method: 'POST',
                    body: parsedBody,
                  };

                  const customRes = {
                    statusCode: 200,
                    setHeader(name: string, value: string) {
                      res.setHeader(name, value);
                      return this;
                    },
                    status(code: number) {
                      this.statusCode = code;
                      res.statusCode = code;
                      return this;
                    },
                    json(data: any) {
                      res.setHeader('Content-Type', 'application/json');
                      res.statusCode = this.statusCode || 200;
                      res.end(JSON.stringify(data));
                    },
                    end(content?: string) {
                      res.end(content);
                    },
                  };

                  await handler(customReq, customRes);
                } catch (err: any) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(
                    JSON.stringify({
                      error: 'Internal Server Error in local dev middleware',
                      message: err?.message,
                    })
                  );
                }
              });
            } else {
              res.statusCode = 405;
              res.end('Method Not Allowed');
            }
          });
        },
      },
    ],
  };
});

