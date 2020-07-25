import express, { response } from 'express';
import axios from 'axios'

export const register = (app: express.Application, mainNodes: String[], otherNodes: String[][], bidMap: number[][],
                         nextNodeId: number, replaceNode: (failedNodes: String[]) => any) => {

    app.get('/', function (req, res) {
        res.send('Hello World!');
    });

    //BIDS

    app.get('/bids', async function (req, res) {
        try {
            let bids = await getFromMainNodes(mainNodes, "bids");
            res.json(bids);

        } catch (failedNode) {
            res.status(400);
            res.send("Hubo un error al cargar las subastas");
            replaceNode(failedNode);
        }
    })

    app.post('/bids', function (req, res) {
        //Chequear esto para ver donde esta la subasta
        const clusterToAddBid = bidCount(bidMap) % mainNodes.length + 1
        const nodeToAddBid = mainNodes[clusterToAddBid]

        req.body.id = nextNodeId;

        redirect(req, nodeToAddBid)
            .then(response => addToBidMap(bidMap, nextNodeId, clusterToAddBid)) //probablemente haya que modificar addToBidMap para que funcione como promise
            .then(response => res.send("Subasta agregada!"))
            .catch(error => console.log("Error agregando subasta"))
    })

    //TODO: hacer metodo para que le avisen a api que cerro una subasta, asi puede updatear el bidmap

    //BUYERS

    app.get('/buyers', async function (req, res) {
        try {
            let buyers = await getFromMainNodes(mainNodes, "buyers");
            res.json(buyers);

        } catch (failedNode) {
            res.status(400);
            res.send("Hubo un error al cargar los compradores");

            replaceNode(failedNode);
        }
    })
}

const redirect = function (request: any, nodeToAddBid: String) {
    const { method, originalUrl, body, headers } = request;
    //Revisar la url a la que tiene que llamarse
    const url = originalUrl.replace("8080", nodeToAddBid)
    return axios({
        url: url,
        method: method,
        data: body,
        headers: headers
    });
}

const getFromMainNodes = async (mainNodes: String[], endpoint: String) => {
    let elementsPromises = await Promise.all(mainNodes.map(async node => await getPromiseFromNode(node, endpoint)));

    let elements: any = elementsPromises.map(elementPromise => elementPromise.data);

    return elements.flat();
}

const getPromiseFromNode = (node: String, endpoint: String) => {
    return axios.get(`http://${node}/${endpoint}`);
}

const bidCount = function(bidMap: number[][]) {
  return bidMap.reduce((total, clusterBids) => total + clusterBids.length, 0)
}

//ver si esto updatea realmente. modifica el valor de la referencia? no se, todavia no se mucho de js. lo veremos en el proximo capitulo de dragon ball z
const addToBidMap = function(bidmap: number[][], nextNodeId: number, clusterToAddBid: number) {
  ++nextNodeId;
  bidmap[clusterToAddBid].push(nextNodeId);
}