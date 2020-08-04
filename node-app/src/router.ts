import controllers from './controllers';
import express from 'express';
import { createJsonResponse } from './utils/response';

export const register = (app: express.Application) => {

    //////// Datos de prueba ///////


/*** Routes ***/

    app.get('/', function (req, res) {
        res.send('Bienvenidos a la app de subastas');
    });

    ////////////////////////////////////////////
    /////////////////// BIDS ///////////////////
    
    app.get('/bids', function (req, res) {
        res.json(controllers.getCurrentBids());
    });

    app.post('/bids/new', async function (req, res) {
        let {id, basePrice, hours, tags} = req.body;
        let response = await controllers.addNewBid(id, basePrice, hours, tags); 
        res.send(response);
    });

    app.post('/bids/offer', function (req, res) {
        let {id, newPrice, buyerIp} = req.body;
        let response = controllers.processNewOffer(id, newPrice, buyerIp);
        res.send(response);
    });

    app.post('/bids/update', function (req, res) {
        let { _id, _basePrice, _hours, _tags, _started, _currentWinner } = req.body;
        let response = controllers.updateBid(_id, _basePrice, _hours, _tags, _started, _currentWinner);
        res.send(response);
    });

    app.post('/bids/close', function (req, res) {
        let {id} = req.body
        controllers.closeBid(id)
        res.send(createJsonResponse(`Se cerro correctamente`, 200));
    });

    app.post('/bids/cancel', async function (req, res) {
      let {id} = req.body
      await controllers.cancelBid(id)
      res.send(createJsonResponse(`Se cancelo correctamente`, 200));
  });

    app.post('/new/main', async function (req, res) {
        await controllers.startAllBids()
        res.send(createJsonResponse(`Se iniciaron los bids correctamente`, 200));
    });

    ////////////////////////////////////////////
    /////////////////// BUYERS /////////////////

    app.get('/buyers', function (req, res) {
        res.json(controllers.getCurrentBuyers());
    });

    app.post('/buyers/new', function (req, res) {
        let {ip, tags, name} = req.body;
        let response = controllers.addNewBuyer(name, ip, tags);
        res.send(response);
    });

    app.post('/buyers/update', function (req, res) {
        let {_name,_ip, _tags} = req.body;
        let response = controllers.updateBuyer(_ip, _name, _tags);
        res.send(response);
    });


    ////////////////////////////////////////////
    /////////////////// PING ///////////////////
    app.get('/ping', function (req, res) {
        res.json('MUY BIEN 10 ;)');
    });

    app.post('/update_network_state', function (req, res) {
        controllers.updateBidMainNode(req.body.main);
        controllers.updateBuyerMainNode(req.body.main);
    });

}