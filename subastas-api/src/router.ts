import express from 'express';
import axios from 'axios'

export const register = (app: express.Application, mainNodes: String[], otherNodes: String[], replaceNode: (failedNodes: String[]) => any) => {

    app.get('/', function (req, res) {
        res.send('Hello World!');
    });

    app.get('/bids', async function (req, res) {
        try {
            //Chequear si nos queremos traer las subastas de todos los nodos o solo del primero
            let bidsPromises = await Promise.all(mainNodes.map(async node => await getBidPromise(node) ));

            bidsPromises.forEach(bidPromise => console.log(bidPromise.data));

            let bids = bidsPromises.map(bidPromise => bidPromise.data);

            res.json(flatBids(bids));

        } catch (failedNode) {
            res.status(400);
            res.send("Hubo un error al cargar las subastas");
            console.log(failedNode);

            // replaceNode(failedNode)
        }
    })

    app.post('/bids', function (req, res) {
        redirect(req)
            .then(response => res.send("Subasta agregada!"))
            .catch(error => console.log("Error agregando subasta"))
    })

    app.post('/bids', function (req, res) {
        //Chequear esto para ver donde esta la subasta
        const node = mainNodes[Math.floor(Math.random() * mainNodes.length)]

        redirect(req)
            .then(response => res.send("Subasta agregada!"))
            .catch(error => console.log("Error agregando subasta"))
    })
}

const redirect = function (request: any) {
    const node = findNode()
    const { method, originalUrl, body, headers } = request;
    //Revisar la url a la que tiene que llamarse
    const url = originalUrl.replace("8080", node)
    return axios({
        url: url,
        method: method,
        data: body,
        headers: headers
    });
}

//Chequear esto para ver donde esta la subasta
const findNode = function () {
    return 0;
}

const flatBids = function (bids: any) {
    return bids.flat();
}

const getBidPromise = (node: String) => {
    return axios.get(`http://${node}/bids`);
}