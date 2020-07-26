import express, { response } from 'express';
import controllers from './controllers';
import axios from 'axios'

export const register = (app: express.Application, mainNodes: String[], otherNodes: String[][], bidMap: number[][],
  nextNodeId: number, replaceNode: (failedNodes: String[]) => any) => {

  app.get('/', function (req, res) {
    res.send('Hello World!');
  });

  //BIDS

  app.get('/bids', async function (req, res) {
    try {
      let bids = await controllers.getAllBidsFromNodes(mainNodes);
      res.json(bids);
    } catch (failedNode) {
      res.status(400);
      res.send("Hubo un error al cargar las subastas");
      replaceNode(failedNode);
    }

  })

  app.post('/bids/new', async function (req, res) {
    try {
      const clusterToAddBid = nextBidCluster(bidMap)
      const nodeToAddBid = mainNodes[clusterToAddBid]
      req.body.id = nextNodeId;

      await axios.post(`http://${nodeToAddBid}/bids/new`, req.body);

      res.send("Subasta agregada!");

      addToBidMap(bidMap, nextNodeId, clusterToAddBid);

    } catch (error) {
      res.status(400);
      res.send("Error agregando subasta");
    }

    // const clusterToAddBid = nextBidCluster(bidMap)
    // const nodeToAddBid = mainNodes[clusterToAddBid]
    // req.body.id = nextNodeId;

    //   redirect(req, nodeToAddBid)
    //       .then(response => addToBidMap(bidMap, nextNodeId, clusterToAddBid))
    //       .then(response => res.send("Subasta agregada!"))
    //       .catch(error => {console.log("Error agregando subasta"))
  })

  app.post('/bids/close', function (req, res) {
    const clusterToCloseBid = findBidCluster(bidMap, req.body.id)
    const index = bidMap[clusterToCloseBid].indexOf(req.body.id);
    bidMap[clusterToCloseBid].splice(index, 1)
    res.send('Subasta terminada')
  })

  app.put('/bids', function (req, res) {
    const clusterToAddBid = findBidCluster(bidMap, req.body.id)

    if (clusterToAddBid == -1) {
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
      let buyers = await controllers.getAllBuyersFromNodes(mainNodes);
      res.json(buyers);
    } catch (failedNode) {
      res.status(400);
      res.send("Hubo un error al cargar los compradores");
      replaceNode(failedNode);
    }
  })

  app.post('/buyers/new', async function (req, res) {
    try {
      const clusterToAddBid = nextBidCluster(bidMap)
      const nodeToAddBid = mainNodes[clusterToAddBid]
      req.body.id = nextNodeId;

      await axios.post(`http://${nodeToAddBid}/buyers/new`, req.body);

      res.send("Comprador agregado!");

      addToBidMap(bidMap, nextNodeId, clusterToAddBid);

    } catch (error) {
      res.status(400);
      res.send("Error agregando comprador");
    }
  })
}

const redirect = function (request: any, nodeToAddBid: String) {
  const { method, url, body, headers } = request;
  return axios({
    url: `${nodeToAddBid}${url}`,
    method: method,
    data: body.data,
    headers: headers
  });
}

const nextBidCluster = function (bidMap: number[][]) {
  const bidCounts = bidMap.map(bids => bids.length)
  return bidCounts.indexOf(Math.min.apply(Math, bidCounts))
}

//ver si esto updatea realmente. modifica el valor de la referencia? no se, todavia no se mucho de js. lo veremos en el proximo capitulo de dragon ball z
const addToBidMap = async function (bidmap: number[][], nextNodeId: number, clusterToAddBid: number) {
  bidmap[clusterToAddBid].push(nextNodeId);
  nextNodeId++;
}

const findBidCluster = function (bidMap: number[][], bidId: number) {
  let i = 0;
  for (; i < bidMap.length; ++i) {
    if (bidMap[i].includes(bidId)) break;
  }

  if (i >= bidMap.length)
    return -1

  return i + 1;
}