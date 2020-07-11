import { Bid } from '../models/bids';
import { createJsonResponse } from '../utils/response'

let bidsList: Bid[] = [];

export const addNewBid = (basePrice: number, hours: number, tags: String[]) => {
    let id = 1;

    if (bidsList.length > 0) {
        var lastExistingId = bidsList.slice(-1)[0].id;
        id = lastExistingId + 1;
    }

    let bid = new Bid(id, basePrice, hours, tags);

    bidsList.push(bid);

    createJsonResponse(bid, 200)
}


export const updateBid = (id: number, basePrice?: number, hours?: number, tags?: String[]) => {
    let bid: Bid = bidsList.find((b: Bid) => {
        return b._id == id
    });

    bid._basePrice = (basePrice != null || basePrice != undefined) ? basePrice : bid._basePrice;
    bid._hours = (hours != null || hours != undefined) ? hours : bid._hours;
    bid._tags = (tags != null || tags != undefined) ? tags : bid._tags;

    let index = bidsList.indexOf(bid);
    bidsList[index] = bid;

    createJsonResponse(bid, 200)
}


export const getCurrentBids = () => { return bidsList };