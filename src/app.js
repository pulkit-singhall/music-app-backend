import express from "express";
import podcastRoute from "./routes/podcast.routes.js";
import categoryRouter from "./routes/category.routes.js";
import songRouter from "./routes/songs.routes.js";
import albumRouter from "./routes/album.routes.js";

const app = express();

app.use("/api/v1/podcast", podcastRoute)
app.use("/api/v1/category", categoryRouter)
app.use("/api/v1/song", songRouter)
app.use("/api/v1/album", albumRouter)

export default app;