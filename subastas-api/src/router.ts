import express from 'express';
import axios from 'axios'

export const register = (app: express.Application, mainNodes: String[], otherNodes: String[], replaceNode: (failedNodes: String[]) => any) => {

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

const getFromMainNodes = async (mainNodes: String[], endpoint: String) => {
    let elementsPromises = await Promise.all(mainNodes.map(async node => await getPromiseFromNode(node, endpoint)));

    let elements: any = elementsPromises.map(elementPromise => elementPromise.data);

    return elements.flat();
}

//Chequear esto para ver donde esta la subasta
const findNode = function () {
    return 0;
}

const getPromiseFromNode = (node: String, endpoint: String) => {
    return axios.get(`http://${node}/${endpoint}`);
}