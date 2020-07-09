import express from 'express';

export const register = (app: express.Application) => {

    var buyers = buyersModule.buyers;
    var bids = bidsModule.bids;

    app.get('/', function (req, res) {
        res.send('Hello World!');
    });

}