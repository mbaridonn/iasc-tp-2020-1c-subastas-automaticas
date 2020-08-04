import express from "express";
import * as bodyParser from "body-parser";
import axios from 'axios';

// Create a new express app instance
const app: express.Application = express();
const port: number = 3000;

app.use(bodyParser.json());

app.listen(port, function () {
    console.log(`Vendedor started at http://localhost:${port}`);
});

const main = async () => {
    let api = 'http://subastas-api:3000';

    let bid = {
        basePrice: 500,
        hours: 120, //dura 2 minuto en memoria
        tags: [
            "books"
        ]
    };

    console.log('Vendedor postea una bid');
    await axios.post(`${api}/bids/new/`, bid);
}

app.post('/execute', async (req, res) => {
    await main();
    res.send("Vendedor ejecutado");
})

app.post('/finish', async (req, res) => {
    res.send("No era lo que esperaba, pero me voy aprobado..");
})