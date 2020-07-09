import express from "express";
import * as router from "./router";
import * as bodyParser from "body-parser";

// Create a new express app instance
const app: express.Application = express();
const port: number = 3000;

app.use(bodyParser.json());

router.register(app);

app.listen(port, function () {
    console.log(`Server started at http://localhost:${port}`);
});