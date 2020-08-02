import { getFromMainNodes } from '../utils/nodes';
import axios from 'axios'

let bidMap: number[][] = [[], [], []];
let bidId: number = 0;

export const getAllBidsFromNodes = async (mainNodes: String[]) => {
    return await getFromMainNodes(mainNodes, "bids");
}

export const addNewBid = async (mainNodes: String[], bid: any) => {
    const clusterToAddBid = nextBidCluster(bidMap)
    const nodeToAddBid = mainNodes[clusterToAddBid]
    bidId++;
    addToBidMap(bidId, clusterToAddBid);
    axios.post(`http://${nodeToAddBid}/bids/new`, { id: bidId, ...bid})
    .then(respose => {
        return "Se agrego el bid correctamente."
    })
    .catch(err => {
        return "Fallo al agregar BidPam"+err.message
    });
}

export const closeBid = async (bid: any) => {
    const clusterToCloseBid = findBidCluster(bid.id)
    const index = bidMap[clusterToCloseBid].indexOf(bid.id);
    if(index > -1){
        bidMap[clusterToCloseBid].splice(index, 1);
    }
}

export const updateBid = async (mainNodes: String[], bid: any) => {
    let responseMessage = "";

    const clusterToUpdateBid = findBidCluster(bid.id);
    if (clusterToUpdateBid == -1) {
        responseMessage = "No existe la subasta!";
    } else {
        const bidNode = mainNodes[clusterToUpdateBid];
        await axios.put(`http://${bidNode}/bids`, bid);
        responseMessage = "Subasta modificada!";
    }

    return responseMessage;
}

export const addNewBidOffer = async (mainNodes: String[], offer: any) => {
    let response;
    const clusterToAddBidOffer = findBidCluster(offer.id)
    if(clusterToAddBidOffer > -1){
        const nodeToAddBidOffer = mainNodes[clusterToAddBidOffer]
        response = await axios.post(`http://${nodeToAddBidOffer}/bids/offer`, offer).then(resp => { return resp }).catch(err => { return err });
    }else{
        response = "No existe la subasta!"
    }
    return response;
}

const getNextNodeId = () => {
    let bidsTotal = 0;
    bidMap.forEach(bidsInNode => bidsTotal += bidsInNode.length);
    bidsTotal++;
    return bidsTotal;
}

const nextBidCluster = function (bidMap: number[][]) {
    const bidCounts = bidMap.map(bids => bids.length)
    return bidCounts.indexOf(Math.min.apply(Math, bidCounts))
}

const addToBidMap = async function (bidId: number, clusterToAddBid: number) {
    bidMap[clusterToAddBid].push(bidId);
}

const findBidCluster = function (bidId: number) {
    let i = 0;
    for (; i < bidMap.length; ++i) {
        if (bidMap[i].includes(bidId)) break;
    }

    if (i >= bidMap.length)
        return -1

    return i;
}