import express from "express";
import * as bodyParser from "body-parser";
import axios from 'axios';

// Create a new express app instance
const app: express.Application = express();
const port: number = 3000;

const api = 'http://subastas-api:3000';
const buyer = {
    name: 'Rick Harrison',
    ip: 'cliente-rick:3000',
    tags: ['books', 'antiguedades', 'weapons', , 'tech']
};

app.use(bodyParser.json());

app.listen(port, function () {
    console.log(`Cliente Rick Harrison started at http://localhost:${port}`);
});

const main = async () => {
    let bidIdToOffer = "";

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
            newPrice: 1000,
            buyerIp: buyer.ip
        }
        console.log(`${buyer.name} hace una oferta a la bid de ID:${bidOffer.id} con un nuevo precio de ${bidOffer.newPrice} rupias`);
        await axios.post(`${api}/bids/offer`, bidOffer);
    }, 10000);

}


const main2 = async () => {
    ofertaViolento()
}

const main3 = async () => {
    ofertaViolento()
}


const ofertaViolento = () =>{
    let bidToOffer: Bid[]

    setTimeout(async () => {
        let response = await axios.get(`${api}/bids`);
        let bids: Bid[] = response.data;
        bidToOffer = bids.filter( bid => bid._tags.some( tag => buyer.tags.includes(tag)))
    }, 5000);

    setTimeout(async () => {
        await Promise.all(
        bidToOffer.map(async bid => {
            sendOfferRequest(bid)
        })
    );
        
        console.log("No lo se Rick, parece aprobado!")
    }, 16000);
}


const sendOfferRequest = async (bid: Bid) => {
    let newPrice = bid._basePrice
    let failCount = 0
    for(let i = 0; i < 30; i++){
        newPrice = newPrice + 100
        let bidOffer = {
            id: bid._id,
            newPrice: newPrice,
            buyerIp: buyer.ip
        }

        if(failCount > 5){
            console.log("Me aburri de ofertar..")
            break
        }

        console.log(`${buyer.name} hace una oferta a la bid de ID:${bidOffer.id} con un nuevo precio de ${bidOffer.newPrice} rupias`);
        await axios.post(`${api}/bids/offer`, bidOffer)
        .catch(err => {
            failCount++
            console.log("Fallo al ofertar")
        })
        await delay(1000);
    }
}



app.post('/execute', async (req, res) => {
    await main();
    res.send("Cliente Rick Harrison ejecutado");
})


app.post('/execute2', async (req, res) => {
    await main2();
    res.send("Cliente Rick Harrison ejecutado");
})

app.post('/execute3', async (req, res) => {
    await main3();
    res.send("Cliente Corey Harrison ejecutado");
})


app.post('/offerNotification', async (req, res) => {
    let message = req.body.message;
    console.log(message);
    res.send("La oferta fue notificada al cliente Rick Harrison");
})



function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}


class Bid {
    _tags: string[];
    _id: string;
    _basePrice: number;
}