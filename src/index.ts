import express from "express";
import * as router from "./router";

// Create a new express app instance
const app: express.Application = express();
const port: number = 3000;

router.register(app);

app.listen(port, function () {
    console.log(`Server started at http://localhost:${port}`);
});