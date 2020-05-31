import express from "express";
import * as buyersModule from './models/buyers';
import * as bidsModule from './models/bids';

export const register = (app: express.Application) => {

    var buyers = buyersModule.buyers;
    var bids = bidsModule.bids;

    app.get('/', function (req, res) {
        res.send('Hello World!');
    });

    app.get('/buyers', function (req, res) {
        res.json(buyers);
    });

    app.post('/buyers', function (req, res) {
        var newBuyer = req.body
        buyers.push(newBuyer);
        res.json(newBuyer);
    });

    app.get('/bids', function (req, res) {
        res.json(bids);
    });

    app.post('/bids', function (req, res) {
        var newBid = req.body
        bids.push(newBid);
        res.json(newBid);
    });

}