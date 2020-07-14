import express from 'express';
import axios from 'axios'

export const register = (app: express.Application, mainNodes: Array<number>, otherNodes: Array<number>, replaceNode: (failedNodes: Array<number>) => any) => {

    app.get('/', function (req, res) {
        res.send('Hello World!');
    });

    app.get('/bids', async function(req, res) {
        try {
            let bids = await Promise.all(mainNodes.map(node => nodeBids(node)))
            res.send(mapBids(bids))
        }catch(failedNode){
            replaceNode(failedNode)
            res.status(400)
            res.send("error")
        }
    })

    app.post('/bids', function(req, res){
        redirect(req)
            .then(response => res.send("Subasta agregada!"))
            .catch(error => console.log("Error agregando subasta"))
    })

    app.post('/bids', function(req, res){
        //Chequear esto para ver donde esta la subasta
        const node = mainNodes[Math.floor(Math.random() * mainNodes.length)]

        redirect(req)
            .then(response => res.send("Subasta agregada!"))
            .catch(error => console.log("Error agregando subasta"))
    })
}

const redirect = function(request: any){
    const node = findNode()
    const { method, originalUrl, body, headers} = request;
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
    return 0
}

const mapBids = function (bids: any) {
    return bids.flat()
}

const nodeBids = function(node: number){
    // return axios.get(`https://localhost:${node}/bids`)
}