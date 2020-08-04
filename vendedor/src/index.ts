import express from "express";
import * as bodyParser from "body-parser";
import axios from 'axios';

// Create a new express app instance
const app: express.Application = express();
const port: number = 3000;
const api = 'http://subastas-api:3000';
const rick = 'http://cliente-rick:3000';
const corey = 'http://cliente-corey:3000';


app.use(bodyParser.json());

app.listen(port, function () {
    console.log(`Vendedor started at http://localhost:${port}`);
});

const main = async () => {
    
    console.log('==================');
    console.log('|INICIANDO PRUEBA|');
    console.log('==================');

    let bid = {
        basePrice: 500,
        hours: 30, 
        tags: [
            "books"
        ]
    };

    axios.post(`${rick}/execute`, bid);
    axios.post(`${corey}/execute`, bid);

    console.log('Vendedor postea una bid');
    await axios.post(`${api}/bids/new/`, bid);
}

const main2 = async () => {
    
    console.log('===================');
    console.log('|INICIANDO PRUEBA 2|');
    console.log('===================');

    let bid = {
        basePrice: 500,
        hours: 60, //dura 2 minuto en memoria
        tags: [
            "books"
        ]
    };

    axios.post(`${rick}/execute2`, bid).catch(err => {console.log("Fallo rick 2", err)});
    axios.post(`${corey}/execute2`, bid).catch(err => {console.log("Fallo corey 2", err)});

    console.log('Vendedor postea una bid');
    await axios.post(`${api}/bids/new/`, bid);
}


const main3 = async () => {

    console.log('===================');
    console.log('|INICIANDO PRUEBA 3|');
    console.log('===================');

    let bid = {
        basePrice: 500,
        hours: 60, 
        tags: [
            "books"
        ]
    };

    axios.post(`${rick}/execute2`, bid).catch(err => {console.log("Fallo rick 2", err)});
    axios.post(`${corey}/execute2`, bid).catch(err => {console.log("Fallo corey 2", err)});

    console.log('Vendedor postea una bid');
    axios.post(`${api}/bids/new/`, bid)
    .then(resp => {
        let id = JSON.parse(resp.data.bid)._id
        setTimeout(async () => {
                await axios.post(`${api}/bids/cancel`, {id})
                .catch(err => {console.log("Fallo al cancelar la subasta", err)});
            }, 25000);
    })
    .catch(err => {
        console.log("Vendedor fallo al crear una bid")
    })
}



const main4 = async () => {


    console.log('===================');
    console.log('|INICIANDO PRUEBA 4|');
    console.log('===================');


    let bid = {
        basePrice: 500,
        hours: 70, 
        tags: [
            "antiguedades"
        ]
    };

    let bid2 = {
        basePrice: 100,
        hours: 50, 
        tags: [
            "books",
            "tech"
        ]
    };

    let bid3 = {
        basePrice: 1000,
        hours: 30, 
        tags: [
            "music"
        ]
    };

    axios.post(`${rick}/execute3`, bid).catch(err => {console.log("Fallo rick 2", err)});
    axios.post(`${corey}/execute3`, bid).catch(err => {console.log("Fallo corey 2", err)});

    console.log('Vendedor postea una bid');
    axios.post(`${api}/bids/new/`, bid).catch()
    axios.post(`${api}/bids/new/`, bid2).catch()
    axios.post(`${api}/bids/new/`, bid3).catch()

}



app.post('/execute', async (req, res) => {
    await main();
    res.send("Vendedor ejecutado");
})

app.post('/execute2', async (req, res) => {
    await main2();
    res.send("Vendedor ejecutado");
})

app.post('/execute3', async (req, res) => {
    await main3();
    res.send("Vendedor ejecutado");
})

app.post('/execute4', async (req, res) => {
    await main4();
    res.send("Vendedor ejecutado");
})

app.post('/finish', async (req, res) => {
    res.send("No era lo que esperaba, pero me voy aprobado..");
})