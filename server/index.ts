import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Seed the database with initial data
  const { seedDatabase } = await import("./seed");
  await seedDatabase();

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '8000', 10);
  // On some platforms (notably Windows) the `reusePort` option uses
  // SO_REUSEPORT which is unsupported and raises ENOTSUP. Only enable
  // reusePort when the platform supports it (not on win32).
  const baseListenOptions: any = {
    host: "127.0.0.1",
  };

  if (process.platform !== "win32") {
    baseListenOptions.reusePort = true;
  }

  // Try to bind to the requested port, but if it's already in use
  // (EADDRINUSE) we'll attempt a small range of fallback ports so
  // local development is less brittle. If all attempts fail we throw
  // a clear error.
  async function tryListen(startPort: number, attempts = 10) {
    let lastErr: any = null;
    for (let i = 0; i < attempts; i++) {
      // choose a port to try
      const tryPort = startPort + i;

      // build options fresh for each attempt
      const opts: any = { ...baseListenOptions, port: tryPort };

      try {
        await new Promise<void>((resolve, reject) => {
          const onError = (err: NodeJS.ErrnoException) => {
            server.removeListener("listening", onListening);
            server.removeListener("error", onError);
            reject(err);
          };

          const onListening = () => {
            server.removeListener("error", onError);
            server.removeListener("listening", onListening);
            resolve();
          };

          server.once("error", onError);
          server.once("listening", onListening);
          // node's listen accepts either (port, host, cb) or an options object
          // pass the options object for clarity
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore - Node's types accept these options on listen
          server.listen(opts);
        });

        // success
        return tryPort;
      } catch (err: any) {
        lastErr = err;
        // Only continue retrying on EADDRINUSE. Other errors should fail fast.
        if (err && err.code === "EADDRINUSE") {
          log(`port ${tryPort} is in use, trying next port...`);
          // continue loop to try next port
        } else {
          throw err;
        }
      }
    }

    // All attempts failed
    const message = lastErr ? `${lastErr.message} (code=${lastErr.code})` : "Failed to bind to port(s)";
    throw new Error(`Could not start server: ${message}`);
  }

  try {
    const boundPort = await tryListen(port, 10);
    log(`serving on port ${boundPort}`);
  } catch (e) {
    // surface a helpful error and exit with non-zero code
    console.error("Failed to start server:", e);
    process.exit(1);
  }
})();
