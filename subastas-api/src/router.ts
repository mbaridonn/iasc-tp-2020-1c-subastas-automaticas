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
        const clusterToAddBid = nextBidCluster(bidMap)
        const nodeToAddBid = mainNodes[clusterToAddBid]

        req.body.id = nextNodeId;

        redirect(req, nodeToAddBid)
            .then(response => addToBidMap(bidMap, nextNodeId, clusterToAddBid))
            .then(response => res.send("Subasta agregada!"))
            .catch(error => console.log("Error agregando subasta"))
    })

    app.post('/bids/close', function (req, res) {
      const clusterToCloseBid = findBidCluster(bidMap, req.body.id)
      const index = bidMap[clusterToCloseBid].indexOf(req.body.id);
      bidMap[clusterToCloseBid].splice(index, 1)
      res.send('Subasta terminada')
    })

    app.put('/bids', function (req, res) {
      const clusterToAddBid = findBidCluster(bidMap, req.body.id)

      if(clusterToAddBid == -1){
        res.send("No existe la subasta!")
      }

      const bidNode = mainNodes[clusterToAddBid]

      redirect(req, bidNode)
          .then(response => res.send("Subasta modificada!"))
          .catch(error => console.log("Error modificando subasta"))
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

const redirect = function (request: any, nodeToAddBid: String) {
    const { method, url, body, headers } = request;
    return axios({
        url: `http://${nodeToAddBid}${url}`,
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

const nextBidCluster = function(bidMap: number[][]) {
  const bidCounts = bidMap.map(bids => bids.length)
  return bidMap.indexOf(Math.min.apply(Math, bidCounts)) + 1
}

//ver si esto updatea realmente. modifica el valor de la referencia? no se, todavia no se mucho de js. lo veremos en el proximo capitulo de dragon ball z
const addToBidMap = async function(bidmap: number[][], nextNodeId: number, clusterToAddBid: number) {
  ++nextNodeId;
  bidmap[clusterToAddBid].push(nextNodeId);
}

const findBidCluster = function(bidMap: number[][], bidId: number) {
  let i = 0;
  for(; i < bidMap.length; ++i) {
    if (bidMap[i].includes(bidId)) break;
  }

  if (i >= bidMap.length)
    return -1

  return i + 1;
}