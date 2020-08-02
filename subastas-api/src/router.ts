import express, { response } from 'express';
import controllers from './controllers';
import axios from 'axios'

export const register = (app: express.Application, mainNodes: String[]) => {

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
    }

  })

  app.post('/bids/new', async function (req, res) {
    try {
      let bid = req.body;
      controllers.addNewBid(mainNodes, bid);
      res.send("Subasta agregada!");

    } catch (error) {
      res.status(400);
      res.send("Error agregando la subasta");
    }
  })

  app.post('/bids/offer', async function (req, res) {
    try {
      let offer = req.body
      controllers.addNewBidOffer(mainNodes, offer);
      res.send("Oferta recibida!");

    } catch (error) {
      res.status(400);
      res.send("Error enviando la oferta");
    }
  })

  app.post('/bids/close', function (req, res) {
    try{
      let bid = req.body;
      controllers.closeBid(bid);
      res.send('Subasta terminada');

    } catch(error){
      res.status(400);
      res.send("Error cerrando la subasta");
    }
  })

  //BUYERS

  app.get('/buyers', async function (req, res) {
    try {
      let buyers = await controllers.getAllBuyersFromNodes(mainNodes);
      res.json(buyers);
    } catch (failedNode) {
      res.status(400);
      res.send("Hubo un error al cargar los compradores");
    }
  })

  //ToDo: ver el tema de como se agregaban buyers a los nodos
  app.post('/buyers/new', async function (req, res) {
    try {
      let buyer = req.body;
      await controllers.addNewBuyer(mainNodes, buyer);
      res.send("Comprador agregado!");

    } catch (error) {
      //TODO: HACER RETRY
      res.status(400);
      res.send("Error agregando comprador");
    }
  })
}

//me gusta el redirect pero no lo pude hacer andar -> F
const redirect = function (request: any, nodeToAddBid: String) {
  const { method, url, body, headers } = request;
  return axios({
    url: `${nodeToAddBid}${url}`,
    method: method,
    data: body.data,
    headers: headers
  });
}