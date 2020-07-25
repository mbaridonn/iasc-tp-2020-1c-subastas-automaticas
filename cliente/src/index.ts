import express from "express";
import * as bodyParser from "body-parser";
import axios from 'axios';

// Create a new express app instance
const app: express.Application = express();
const port: number = 3000;

app.use(bodyParser.json());

// app.listen(port, function () {
//     console.log(`Cliente started at http://localhost:${port}`);
// });

const main = async () => {
    console.log("Cliente iniciado!");

    // let apiEndpoint = 'http://subastas-api:3000/bids';

    // let bid = {
    //     basePrice: 500,
    //     hours: 5,
    //     tags: [
    //         "books"
    //     ]
    // };

    // console.log("Posteo una bid");
    // await axios.post(apiEndpoint, bid);

    // console.log("Me traigo bids");
    // let datos = await axios.get(apiEndpoint);
    // let datosPosta = datos.data;
    // console.log(datosPosta);

}

main();