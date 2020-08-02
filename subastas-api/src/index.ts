import express from "express";
import * as router from "./router";
import * as bodyParser from "body-parser";
import axios from 'axios'

// Create a new express app instance
const app: express.Application = express();
const port: number = 3000;
let mainNodes: String[] = []; //por ahora tenemos un solo main node
let otherNodes: String[][] = [];
const NODE_COUNT = 3

// let amountOfNodes = 0

app.use(bodyParser.json());


/************************************
            Muy Bien 10
*************************************/

const nodeClusterNumber = function(node: string) {
  return parseInt(node.split("-")[3])-1;
}


const replaceNode = function (failedNode: any) {
    console.log("===============================================")
    console.log("===============================================")
    console.log("MAIN", mainNodes)
    console.log("OTHER", otherNodes)
    console.log("________________________________________")
    const clusterNumber = nodeClusterNumber(failedNode);
    console.log("ClusterNumber", clusterNumber)
    let node = otherNodes[clusterNumber].pop();  // 3-2
    let index = mainNodes.indexOf(failedNode);
    mainNodes.splice(index, 1, node); 
    otherNodes[clusterNumber].unshift(failedNode);
    console.log("________________________________________")
    console.log("MAIN AFTER", mainNodes)
    console.log("OTHER AFTER", otherNodes)
    console.log("===============================================")
    console.log("===============================================")
}

router.register(app, mainNodes);

app.listen(port, function () {
    console.log(`Server started at http://localhost:${port}`);
});

const pingNodes = function () {
    let nodes = mainNodes;
    nodes.forEach(node => {
        axios.get(`http://${node}/ping`).catch(err => {
          replaceNode(node)
        })
    })
}

const initScheduler = function () {
    const minutes = 1
    const interval = minutes * 1000
    setInterval(pingNodes, interval)
}

const initNodeLists = function () {
  for (let i = 1; i <= NODE_COUNT; ++i) {
    console.log("INIT!")
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