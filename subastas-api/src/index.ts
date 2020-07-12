import express from "express";
import * as router from "./router";
import * as bodyParser from "body-parser";

// Create a new express app instance
const app: express.Application = express();
const port: number = 3000;
let mainNodes: Array<number>
let otherNodes: Array<number>

let amountOfNodes = 0

app.use(bodyParser.json());

router.register(app, mainNodes, otherNodes);

app.listen(port, function () {
    console.log(`Server started at http://localhost:${port}`);
});

const initNodes = function () {
    addNode(mainNodes)
    addNode(otherNodes)
    addNode(otherNodes)
}

const addNode = function (list: Array<number>) {
    amountOfNodes++
    list.push(port + amountOfNodes)
}