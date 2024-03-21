import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

app.listen(8000 || process.env.PORT, () => { 
    console.log(`app is running at ${process.env.PORT}`);
});