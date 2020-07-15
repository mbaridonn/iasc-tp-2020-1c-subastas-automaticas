import { Bid } from '../models/bids';
import { createJsonResponse } from '../utils/response';
const Notifier = require('../utils/notifier');

let bidsList: Bid[] = [];

export const addNewBid = (basePrice: number, hours: number, tags: String[], notify: boolean = true) => {
    let id = 1;

    if (bidsList.length > 0) {
        var lastExistingId = bidsList.slice(-1)[0].id;
        id = lastExistingId + 1;
    }
    let bid = new Bid(id, basePrice, hours, tags);
    bidsList.push(bid);

    if(notify){
        Notifier.notify('bids/update', bid); //TODO: Parametrizar el path
    }

    return createJsonResponse(bid, 200);
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