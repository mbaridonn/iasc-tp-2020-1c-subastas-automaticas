import { addNewBid, getCurrentBids, updateBid, processNewOffer, notifyEndOfBid, closeBid, initializeBidsFromOtherNode } from './bidsContoller'
import { addNewBuyer, getCurrentBuyers, updateBuyer, initializeBuyersFromOtherNode } from './buyersController'


export = {
    addNewBid,
    addNewBuyer,
    getCurrentBids,
    getCurrentBuyers,
    updateBuyer,
    updateBid,
    processNewOffer,
    notifyEndOfBid,
    initializeBuyersFromOtherNode,
    initializeBidsFromOtherNode,
    closeBid
}