import controllers from './controllers';
import express from 'express';

export const register = (app: express.Application) => {

    //////// Datos de prueba ///////
    
    controllers.addNewBuyer('Juan', '190.19.4.92', ['tech', 'movies'], false);
    controllers.addNewBuyer('Carlos', '190.19.4.14', ['tech', 'movies'], false);

    controllers.addNewBid(100, 3, ['tech', 'movies'], false);

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
        let response = controllers.addNewBid(basePrice, hours, tags);
        res.send(response);
    });

    app.post('/bids/update', function (req, res) {
        let {_id, _basePrice, _hours, _tags} = req.body;
        let response = controllers.updateBid(_id, _basePrice, _hours, _tags);
        res.send(response);
    });

    ////////////////////////////////////////////
    /////////////////// BUYERS /////////////////

    app.get('/buyers', function (req, res) {
        res.json(controllers.getCurrentBuyers());
    });

    app.post('/buyers/new', function (req, res) {
        let {name, ip, tags} = req.body;
        let response = controllers.addNewBuyer(name, ip, tags);
        res.send(response);
    });

    app.post('/buyers/update', function (req, res) {
        let {_name, _ip, _tags} = req.body;
        let response = controllers.updateBuyer(_ip, _name, _tags);
        res.send(response);
    });

}