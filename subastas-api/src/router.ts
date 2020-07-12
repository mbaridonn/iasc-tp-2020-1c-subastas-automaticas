import express from 'express';
// import axios from 'axios'

export const register = (app: express.Application, mainNodes: Array<number>, otherNodes: Array<number>) => {

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

    const replaceNode = function(failedNode: any){
        let node = otherNodes.pop()
        let index = mainNodes.indexOf(failedNode, 0)
        mainNodes.splice(index, 1)
        mainNodes.push(node)
        otherNodes.push(failedNode)
    }
}

const mapBids = function (bids: any) {
    return "bids.flat()"
}

const nodeBids = function(node: number){
    // return axios.get(`https://localhost:${node}/bids`)
}