import express from "express";
import podcastRoute from "./routes/podcast.routes.js";

const app = express();

app.use("/api/v1/podcast", podcastRoute)

export default app;