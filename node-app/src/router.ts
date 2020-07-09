import controllers from './controllers';
import express from 'express';

export const register = (app: express.Application) => {

    app.get('/', function (req, res) {
        res.send('Hello World!');
    });

    app.get('/buyers', function (req, res) {
        res.json(controllers.getCurrentBuyers());
    });

    app.post('/buyers', function (req, res) {
        let {basePrice, hours, tags, ...rest} = req.body;
        let newBid = controllers.addNewBuyer(basePrice, hours, tags);
        res.json(newBid);
    });

    app.get('/bids', function (req, res) {
        res.json(controllers.getCurrentBids());
    });

    app.post('/bids', function (req, res) {
        let {name, ip, tags, ...rest} = req.body;
        let newBuyer = controllers.addNewBuyer(name, ip, tags);
        res.json(newBuyer);
    });

}