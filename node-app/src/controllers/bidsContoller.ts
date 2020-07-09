import { Bid } from '../models/bids';

let bidsList: Bid[] = [
    {
        basePrice: 100,
        hours: 3,
        tags: ['tech', 'movies']
    }
];

export const addNewBid = (basePrice:number, hours:number, tags: String[]) => {
    let bid = new Bid(basePrice, hours, tags);
    bidsList.push(bid);
}

export const getCurrentBids = () => {return bidsList};