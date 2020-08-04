import { Bid } from '../models/bids';
import { Buyer } from '../models/buyers';
import { createJsonResponse } from '../utils/response';
import { BidNotifier } from '../utils/notifier';
import { getCurrentBuyers } from './buyersController'
import axios from 'axios'

let bidsList: Bid[] = [];
let notifier = new BidNotifier();
let mainNode: String;


export const addNewBid = async (id: string, basePrice: number, hours: number, tags: String[], notifyFlag: boolean = true) => {
    let bid = new Bid(id, basePrice, hours, tags);
    if(notifyFlag){
        bid.start() //Notify end of bid
        .then(response => {
            closeBid(response._id);
            return notifyEndOfBid(response).then(resp => {
                return resp;
            })
        })
        .catch(error => {
            return createJsonResponse({message: `Fallo al finalizar la subasta: ${bid._id}`}, 400);
        });
        
        await notifyToContainers(bid);
        let currentBuyers = getCurrentBuyers();
        await notifier.notifyBidToBuyers(bid, currentBuyers, `Se creo una subasta con ID: ${bid._id}. Podria interesarle`)
    }
    bidsList.push(bid);
    return createJsonResponse(bid, 200); 
}


export const processNewOffer = async (bidId:string, newOffer: number, buyerIp: String) => {
    let bid = getBidById(bidId);
    let processedBid = await bid.processOffer(buyerIp, newOffer);
    if(processedBid.success){
        let currentBuyers = getCurrentBuyers();
        await notifier.notifyBidToBuyers(bid, currentBuyers, processedBid.message)
        return createJsonResponse(processedBid.message, 200);
    }else{
        return createJsonResponse(processedBid.message, 400);
    }
}


export const updateBid = (id: string, basePrice?: number, hours?: number, tags?: String[], started?: Date, currentWinner?: String) => {
    let bid: Bid = bidsList.find((b: Bid) => {
        return b._id == id
    });
    if(!bid){
        let bid = new Bid(id, basePrice, hours, tags, started, currentWinner);
        bidsList.push(bid);
        return createJsonResponse(bid, 200);
    }else{
        bid._basePrice = basePrice || bid._basePrice;
        bid._hours = hours || bid._hours;
        bid._tags = tags || bid._tags;
        bid._started = started || bid._started
        bid._currentWinner = currentWinner || bid._currentWinner
    
        let index = bidsList.indexOf(bid);
        if(index > -1){
            bidsList[index] = bid;
            return createJsonResponse(bid, 200)
        }
        return createJsonResponse(`Fallo al actualizar Bid: ${bid._id}`, 400)
    }
}

export const notifyEndOfBid = async (bid:Bid) =>{
    await notifier.notifyEndOfBidToContainers(bid._id);
    return await notifier.notifyBidToBuyers(bid, getCurrentBuyers(), `La subasta ${bid._id} a finalizado a las ${bid._finish.toLocaleString()}. Felicitamos al ganador: ${bid._currentWinner}!`);
}

const notifyToContainers = async (bid:Bid) => {
    let retriesCounter = 0;
        await notifier.notifyToContainers(bid)
        .then(resp => {
            return resp;
        })
        .catch(err => {
            if(retriesCounter < 5){
                setTimeout(() => {
                    retriesCounter++;
                    return notifier.notifyToContainers(bid);                    
                }, 5000);
            }else{
                return createJsonResponse(`Ha ocurrido un error al persistir.`, 400);
            }
        }); 
}


export const getCurrentBids = () => { return bidsList };


export const getBidById = (bidId: string) => {
    return bidsList.find(bid => bid._id == bidId);
};

export const initializeBidsFromOtherNode =  async () => {
  try {
    const bidsResponse = await axios.get(`http://${mainNode}/bids`)
    const bids = bidsResponse.data
    if (JSON.stringify(bids) != JSON.stringify(bidsList)){
        bidsList = []
        bids.forEach((bid: Bid) => { 
            let newBid = new Bid(bid._id, bid._basePrice, bid._hours, bid._tags, bid._started, bid._currentWinner);
            bidsList.push(newBid);
        });
    }
  }
  catch{
    console.error('No se pudieron levantar las bids')
  }
};

export const closeBid=(id: string)=>{
    bidsList = bidsList.filter(bid => bid._id != id);
}

export const cancelBid=(id: string)=>{
  closeBid(id);
  notifier.notifyBidToBuyers(findBid(id), getCurrentBuyers(), `La subasta ${id} fue cancelada. No hay ganadores.`);
}

export const updateBidMainNode = (node: String) => {
  mainNode = node;
}

export const startAllBids = async () => {
    bidsList.forEach( bid => {
        bid.restart()
        .then(response => { 
            closeBid(response._id);
            return notifyEndOfBid(response).then(resp => {
                return resp;
            })
         })
        .catch(err => { err })
    })
}

export const findBid = (id: String) => {
  return bidsList.find((b: Bid) => {
    return b._id == id
});
}