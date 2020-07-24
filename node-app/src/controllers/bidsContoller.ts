import { Bid } from '../models/bids';
import { createJsonResponse } from '../utils/response';
import { BidNotifier } from '../utils/notifier';
import { getCurrentBuyers } from './buyersController'

let bidsList: Bid[] = [];
let notifier = new BidNotifier();

export const addNewBid = async (basePrice: number, hours: number, tags: String[], notifyToContainers: boolean = true) => {
    let id = 1;

    if (bidsList.length > 0) {
        var lastExistingId = bidsList.slice(-1)[0].id;
        id = lastExistingId + 1;
    }
    let bid = new Bid(id, basePrice, hours, tags);
    bidsList.push(bid);

    if(notifyToContainers){
        let retriesCounter = 0;
        await notifier.notifyToContainers(bid)
        .then(resp => {
            return resp;
        })
        .catch(err => {
            if(retriesCounter < 5){
                setTimeout(() => {
                    retriesCounter++;
                    notifier.notifyToContainers(bid);                    
                }, 5000);
            }else{
                return createJsonResponse(`Ha ocurrido un error al persistir.`, 400);
            }
        }); 
    }
    let currentBuyers = getCurrentBuyers();
    await notifier.notifyBidToBuyers(bid, currentBuyers, `Esta subasta podria interesarle: ${bid._id}`)             
    return createJsonResponse(bid, 200); 
}

export const processNewOffer = async (bidId:number, newOffer: number, buyerIp: String) => {
    let bid = getBidById(bidId);
    let processedBid = await bid.processOffer(newOffer);
    if(processedBid.success){
        let currentBuyers = getCurrentBuyers();
        await notifier.notifyBidToBuyers(bid, currentBuyers, processedBid.message)
        return createJsonResponse(processedBid.message, 200);
    }else{
        return createJsonResponse(processedBid.message, 400);
    }
}

export const updateBid = (id: number, basePrice?: number, hours?: number, tags?: String[]) => {
    let bid: Bid = bidsList.find((b: Bid) => {
        return b._id == id
    });

    if(bid == undefined){
        //TODO: Revisar creacion de IDs
        return addNewBid(basePrice, hours, tags, false);        
    }else{
        bid._basePrice = (basePrice != null || basePrice != undefined) ? basePrice : bid._basePrice;
        bid._hours = (hours != null || hours != undefined) ? hours : bid._hours;
        bid._tags = (tags != null || tags != undefined) ? tags : bid._tags;
    
        let index = bidsList.indexOf(bid);
        bidsList[index] = bid;

        return createJsonResponse(bid, 200)
    }
}


export const getCurrentBids = () => { return bidsList };

export const getBidById = (bidId: number) => { 
    return bidsList.find(bid => bid._id == bidId);
};