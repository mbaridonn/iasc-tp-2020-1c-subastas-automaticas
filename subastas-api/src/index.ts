import express from "express";
import * as router from "./router";
import * as bodyParser from "body-parser";
import axios from 'axios'

// Create a new express app instance
const app: express.Application = express();
const port: number = 3000;
let mainNodes: String[] = [];
let otherNodes: String[][] = [];
const NODE_COUNT = 3

// let amountOfNodes = 0

app.use(bodyParser.json());


/************************************
            Muy Bien 10
*************************************/

const nodeClusterNumber = function(node: String) {
  return parseInt(node.split("-")[3])-1;
}

const flattenedOtherNodes = function () {
  return otherNodes.reduce((accumulator, value) => accumulator.concat(value), []);
}

const updateNodeMainReference = function() {
  let nodes = mainNodes.concat(flattenedOtherNodes())
  nodes.forEach((node: String) => updateNetworkState(node))
}

const updateNetworkState = function(node: String){
    axios.post(`http://${node}/update_network_state`, { main: mainNodes[nodeClusterNumber(node)] })
    .catch( err => {
      // console.error(`No se pudo actualizar a ${node}`)
    })
}

const replaceNode = function (failedNode: any) {
    let index = mainNodes.indexOf(failedNode)
    if (index != -1) {
        const clusterNumber = nodeClusterNumber(failedNode);
        let node = otherNodes[clusterNumber].pop()
        mainNodes.splice(index, 1, node);
        otherNodes[clusterNumber].unshift(failedNode);
        updateNodeMainReference();
        notifyNewMain(node);
    }
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
    const minutes = 3
    const interval = minutes * 1000
    setInterval(pingNodes, interval)
    setInterval(updateNodeMainReference, interval)
}

const initNodeLists = function () {
  for (let i = 1; i <= NODE_COUNT; ++i) {
    mainNodes.push(`subastas-node-app-${i}-1:3000`)
    otherNodes.push([`subastas-node-app-${i}-2:3000`,`subastas-node-app-${i}-3:3000`])
  }
}


const notifyNewMain = (node: String) => {
  axios.post(`http://${node}/new/main`).catch(err => { return `Fallo al notificar nuevo main ${node}` })
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