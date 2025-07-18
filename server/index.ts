import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";
import { setupSecurity, addSecurityHeaders, generalLimiter } from "./security";
import { analyticsMiddleware } from "./analytics";

const app = express();
// Setup security middleware first
setupSecurity(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session configuration with enhanced security
app.use(session({
  secret: process.env.SESSION_SECRET || 'military-legal-shield-dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'strict' // CSRF protection
  }
}));

// Trust proxy for proper domain handling
app.set('trust proxy', true);

// Apply general rate limiting to all routes
app.use(generalLimiter);

// Add security headers to all responses
app.use(addSecurityHeaders);

// Force HTTPS and handle custom domain
app.use((req, res, next) => {
  // Handle custom domain requests
  if (req.hostname === 'militarylegalshield.com' || req.hostname === 'www.militarylegalshield.com') {
    res.setHeader('X-Forwarded-Host', req.hostname);
    res.setHeader('X-Custom-Domain', 'militarylegalshield.com');
  }
  next();
});

// Serve military branch emblems from attached_assets
app.use('/attached_assets', express.static(path.join(process.cwd(), 'attached_assets')));

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
  // Setup Vite first but don't add catch-all routes yet
  let server;
  if (app.get("env") === "development") {
    server = await registerRoutes(app);
    await setupVite(app, server);
  } else {
    server = await registerRoutes(app);
    serveStatic(app);
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Use dynamic port building with fallback to 5000 for Replit compatibility  
  // In production, use environment variable; in development, use 5000
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen(port, () => {
    log(`serving on port ${port}`);
  });
})();
