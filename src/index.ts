import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import * as Router from "@koa/router";
import * as Sentry from "@sentry/node";

import { initializeRepository, integrateRepository } from "../integration";
import * as githubRoutes from "git-extractor/src/routes/github";
import logger from "git-extractor/src/middleware/logger";
import errorHandler from "git-extractor/src/middleware/error-handler";
import notFound from "git-extractor/src/middleware/not-found";
import camelize from "git-extractor/src/middleware/camelize";
import decamelize from "git-extractor/src/middleware/decamelize";

const app = new Koa();
const router = new Router();
const PORT = process.env.PORT || 3000;

// Initialize Sentry for error tracking
Sentry.init({
  dsn: process.env.SENTRY_DSN || "",
});

// Middleware setup
app.use(errorHandler);
app.use(logger);
app.use(bodyParser({ jsonLimit: "50mb" }));
app.use(camelize);
app.use(decamelize);
app.use(notFound);

// Define routes
router
  .get(
    "/git/github/data/:username/:repo/:branch*/commit/:commitSha/path/:path*",
    githubRoutes.data
  )
  .get("/git/github/rights/:username/:repo", githubRoutes.getRights)
  .get("/git/github/info/:username/:repo/tree/:branch/:path*", githubRoutes.info)
  .get("/git/github/info/:username/:repo/blob/:branch/:path*", githubRoutes.info)
  .get("/git/github/info/:username/:repo/commit/:branch", githubRoutes.info)
  .get("/git/github/info/:username/:repo", githubRoutes.info)
  .get("/git/github/info/:username/:repo/pull/:pull", githubRoutes.pullInfo)
  .post("/git/github/compare/:username/:repo", githubRoutes.compare)
  .post(
    "/git/github/commit/:username/:repo/:branch*/path/:path*",
    githubRoutes.commit
  )
  .post("/git/github/pr/:username/:repo/:branch*/path/:path*", githubRoutes.pr)
  .post("/git/github/repo/:username/:repo", githubRoutes.repo)
  .get("/integration/test", async (ctx) => {
    try {
      const sandbox = await integrateRepository(
        "codesandbox",
        "codesandbox-importers",
        "main"
      );
      ctx.body = {
        message: "Integration successful",
        sandbox,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: error.message };
    }
  });

// Apply routes to the app
app.use(router.routes()).use(router.allowedMethods());

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Error handling
app.on("error", (err, ctx) => {
  Sentry.withScope((scope) => {
    scope.addEventProcessor((event) =>
      Sentry.Handlers.parseRequest(event, ctx.request)
    );
    Sentry.captureException(err);
  });
});
