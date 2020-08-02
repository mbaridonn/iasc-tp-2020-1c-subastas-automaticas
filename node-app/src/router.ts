import controllers from './controllers';
import express from 'express';

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
        let {bidId, newPrice, buyerIp} = req.body;
        let response = controllers.processNewOffer(bidId, newPrice, buyerIp);
        res.send(response);
    });

    app.post('/bids/update', function (req, res) {
        let { id, basePrice, hours, tags} = req.body;
        let response = controllers.updateBid(id, basePrice, hours, tags);
        res.send(response);
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

}