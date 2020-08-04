import express from "express";
import * as bodyParser from "body-parser";
import axios from 'axios';

// Create a new express app instance
const app: express.Application = express();
const port: number = 3000;

app.use(bodyParser.json());

app.listen(port, function () {
    console.log(`Cliente Corey Harrison started at http://localhost:${port}`);
});

const main = async () => {
    let api = 'http://subastas-api:3000';
    let bidIdToOffer = "";

    let buyer = {
        name: 'Corey Harrison',
        ip: 'cliente-corey:3000',
        tags: ['books']
    };

    console.log(`${buyer.name} se registra en el sistema`);
    await axios.post(`${api}/buyers/new`, buyer);

    setTimeout(async () => {
        let bids = await axios.get(`${api}/bids`);
        let firstBid = bids.data[0];
        bidIdToOffer = firstBid._id;
    }, 5000);

    setTimeout(async () => {
        let bidOffer = {
            id: bidIdToOffer,
            newPrice: 1500,
            buyerIp: "cliente:3000"
        }
        console.log(`${buyer.name} hace una oferta a la bid de ID:${bidOffer.id} con un nuevo precio de ${bidOffer.newPrice} rupias`);
        await axios.post(`${api}/bids/offer`, bidOffer);
    }, 15000);

}

app.post('/execute', async (req, res) => {
    await main();
    res.send("Cliente Corey Harrison ejecutado");
})

app.post('/offerNotification', async (req, res) => {
    let message = req.body.message;
    console.log(message);
    res.send("La oferta fue notificada al cliente Corey Harrison");
})