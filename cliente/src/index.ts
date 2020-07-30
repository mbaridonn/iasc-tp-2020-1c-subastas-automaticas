import express from "express";
import * as bodyParser from "body-parser";
import axios from 'axios';

// Create a new express app instance
const app: express.Application = express();
const port: number = 3000;

app.use(bodyParser.json());

app.listen(port, function () {
    console.log(`Cliente started at http://localhost:${port}`);
});

const main = async () => {
    console.log("Cliente iniciado!");

    let api = 'http://subastas-api:3000';

    let bid = {
        basePrice: 500,
        hours: 5,
        tags: [
            "books"
        ]
    };

    console.log("Posteo una bid");
    await axios.post(`${api}/bids/new/`, bid);

    console.log("Me traigo bids");
    let datos = await axios.get(`${api}/bids`);
    let datosPosta = datos.data;
    console.log(datosPosta);

    console.log("Hago una oferta");
    let bidOffer = {
        bidId: 1,
        newPrice: 1000,
        buyerIp: "cliente:8081"
    }
    await axios.post(`${api}/bids/offer`);
}

app.post('/execute', async (req, res) => {
    await main();
    res.send("Cliente ejecutado");
})