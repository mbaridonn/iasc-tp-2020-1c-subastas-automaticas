import express from "express";
import * as router from "./router";
import * as bodyParser from "body-parser";
import axios from 'axios'

// Create a new express app instance
const app: express.Application = express();
const port: number = 3000;
let mainNodes: Array<number>
let otherNodes: Array<number>

let amountOfNodes = 0

app.use(bodyParser.json());

const replaceNode = function(failedNode: any){
    let node = otherNodes.pop()
    let index = mainNodes.indexOf(failedNode, 0)
    mainNodes.splice(index, 1)
    mainNodes.push(node)
    otherNodes.push(failedNode)
}

router.register(app, mainNodes, otherNodes, replaceNode);

app.listen(port, function () {
    console.log(`Server started at http://localhost:${port}`);
});

const pingNodes = function() {
    let nodes = mainNodes.concat(otherNodes)
    nodes.forEach(node => function(){
        axios.get(`https://localhost:${node}/ping`).catch(err => replaceNode(node))
    })
}

const initScheduler = function(){
    const minutes = 3
    const interval = minutes * 60 * 1000
    setInterval(pingNodes, interval)
}

initScheduler()

const initNodes = function () {
    addNode(mainNodes)
    addNode(otherNodes)
    addNode(otherNodes)
}

const addNode = function (list: Array<number>) {
    amountOfNodes++
    list.push(port + amountOfNodes)
}