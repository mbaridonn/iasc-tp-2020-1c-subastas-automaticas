import express from 'express';

export const register = (app: express.Application) => {

    app.get('/', function (req, res) {
        res.send('Hello World!');
    });

}