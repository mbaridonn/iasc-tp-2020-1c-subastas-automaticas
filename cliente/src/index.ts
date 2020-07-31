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
        hours: 60, //dura 1 minuto en memoria
        tags: [
            "books"
        ]
    };

    let buyer = {
        name: 'Rick',
        ip: 'cliente:3000',
        tags: ['books']
    };

    console.log("Me registro en el sistema");
    await axios.post(`${api}/buyers/new`, buyer);

    console.log("Posteo una bid");
    await axios.post(`${api}/bids/new/`, bid);

    setTimeout(async () => {
        console.log("Hago una oferta");
        let bidOffer = {
            bidId: 1,
            newPrice: 1000,
            buyerIp: "cliente:3000"
        }
        await axios.post(`${api}/bids/offer`, bidOffer);
    }, 5000); //espero un poco porque sino rompe. La API retorna una respuesta y el nodo no termino de procesar

}

app.post('/execute', async (req, res) => {
    await main();
    res.send("Cliente ejecutado");
})

app.post('/offerNotification', async (req, res) => {
    let message = req.body.message;
    console.log(message);
    res.send("La oferta fue notificada al cliente");
})