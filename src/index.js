import express from "express";
import cookieParser from "cookie-parser";

import { PORT } from "./configs/server.config.js";
import appRoutes from "./routes/index.routes.js";
import errorHandler from "./middlewares/error-handler.middleware.js";

const startServerSetup = async () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use("/api", appRoutes);
  app.use(errorHandler);

  app.listen(PORT, async () => {
    console.log("Server started ", PORT);
  });
};

startServerSetup();
