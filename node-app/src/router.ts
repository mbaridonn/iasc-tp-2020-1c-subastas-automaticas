import controllers from './controllers';
import express from 'express';

export const register = (app: express.Application) => {

    //////// Datos de prueba ///////
    
    controllers.addNewBuyer('Juan', '190.19.4.92', ['tech', 'movies']);
    controllers.addNewBuyer('Carlos', '190.19.4.14', ['tech', 'movies']);

    controllers.addNewBid(100, 3, ['tech', 'movies']);

/*** Routes ***/

    app.get('/', function (req, res) {
        res.send('Bienvenidos a la app de subastas');
    });

    ////////////////////////////////////////////
    /////////////////// BIDS ///////////////////
    
    app.get('/bids', function (req, res) {
        res.json(controllers.getCurrentBids());
    });

    app.post('/bids/new', function (req, res) {
        let {basePrice, hours, tags} = req.body;
        let newBid = controllers.addNewBid(basePrice, hours, tags);
        res.json(newBid);
    });

    app.post('/bids/update', function (req, res) {
        let {basePrice, hours, tags} = req.body;
        let newBid = controllers.updateBid(basePrice, hours, tags);
        res.json(newBid);
    });

    ////////////////////////////////////////////
    /////////////////// BUYERS /////////////////

    app.get('/buyers', function (req, res) {
        res.json(controllers.getCurrentBuyers());
    });

    app.post('/buyers/new', function (req, res) {
        let {name, ip, tags} = req.body;
        let newBuyer = controllers.addNewBuyer(name, ip, tags);
        res.json(newBuyer);
    });

    app.post('/buyers/update', function (req, res) {
        let {name, ip, tags} = req.body;
        let newBuyer = controllers.updateBuyer(ip, name, tags);
        res.json(newBuyer);
    });

}