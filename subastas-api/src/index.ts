import express from "express";
import * as router from "./router";
import * as bodyParser from "body-parser";
import axios from 'axios'

// Create a new express app instance
const app: express.Application = express();
const port: number = 3000;
let mainNodes: String[] = []; //por ahora tenemos un solo main node
let otherNodes: String[][] = [];
let bidMap: number[][] = [[], [], []];
let nextNodeId = 1
const NODE_COUNT = 3

// let amountOfNodes = 0

app.use(bodyParser.json());


/************************************
            Muy Bien 10
*************************************/

const nodeClusterNumber = function(node: string) {
  return parseInt(node.replace( /(^.+)(\w\d+\w)(.+$)/i,'$2'))
}

const flattenedOtherNodes = function () {
  return otherNodes.reduce((accumulator, value) => accumulator.concat(value), []);
}

const replaceNode = function (failedNode: any) {
    const clusterNumber = nodeClusterNumber(failedNode)
    let node = otherNodes[clusterNumber].pop();
    let index = mainNodes.indexOf(failedNode, 0);
    mainNodes.splice(index, 1);
    mainNodes.push(node);
    otherNodes[clusterNumber].push(failedNode);
}

router.register(app, mainNodes, otherNodes, bidMap, nextNodeId, replaceNode);

app.listen(port, function () {
    console.log(`Server started at http://localhost:${port}`);
});

const pingNodes = function () {
    let nodes = mainNodes.concat(flattenedOtherNodes())
    nodes.forEach(node => function () {
        axios.get(`https://${node}/ping`).catch(err => replaceNode(node))
    })
}

const initScheduler = function () {
    const minutes = 3
    const interval = minutes * 60 * 1000
    setInterval(pingNodes, interval)
}

const initNodeLists = function () {
  for (let i = 1; i <= NODE_COUNT; ++i) {
    mainNodes.push(`subastas-node-app-${i}-1:3000`)
    otherNodes.push([`subastas-node-app-${i}-2:3000`,`subastas-node-app-${i}-3:3000`])
  }
}

initScheduler()
initNodeLists();

// const initNodes = function () {
//     addNode(mainNodes)
//     addNode(otherNodes)
//     addNode(otherNodes)
// }

// const addNode = function (list: String[]) {
//     amountOfNodes++
//     list.push(port + amountOfNodes)
// }