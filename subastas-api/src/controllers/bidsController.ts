import {getFromMainNodes, getFromMainNodesByNodes} from '../utils/nodes';
import axios from 'axios'
import {hashCode} from "../utils/hash";
import {findCluster, nextCluster} from "../utils/cluster";

let bidMap: string[][] = [[], [], []];
let bidId: number = 0;
let uniqueHostname: string = hashCode(`${process.env.hostname}-${new Date().getTime()}`)

export const getAllBidsFromNodes = async (mainNodes: String[]) => {
    return await getFromMainNodes(mainNodes, "bids");
}

export const addNewBid = async (mainNodes: String[], bid: any) => {
    const clusterToAddBid = nextCluster(bidMap)
    const nodeToAddBid = mainNodes[clusterToAddBid]
    bidId++;
    const bidIdString = `${uniqueHostname}-${bidId}`
    addToBidMap(bidIdString, clusterToAddBid);
    axios.post(`http://${nodeToAddBid}/bids/new`, { id: bidIdString, ...bid})
    .then(respose => {
        return "Se agrego el bid correctamente."
    })
    .catch(err => {
        return "Fallo al agregar BidPam"+err.message
    });
}

export const cancelBid = async (mainNodes: String[], bid: any) => {
    const clusterToCloseBid = await findBidCluster(mainNodes, bid.id)
    const index = bidMap[clusterToCloseBid].indexOf(bid.id);
    if(index > -1){
        bidMap[clusterToCloseBid].splice(index, 1);
        await axios.post(`http://${mainNodes[clusterToCloseBid]}/bids/cancel`, {id: bid.id})
    }
}

export const updateBid = async (mainNodes: String[], bid: any) => {
    try {
        const clusterToUpdateBid = await findBidCluster(mainNodes, bid.id);
        const bidNode = mainNodes[clusterToUpdateBid];
        await axios.put(`http://${bidNode}/bids`, bid);
        return "Subasta modificada!";
    } catch (e) {
        return Promise.reject(e)
    }
}

export const addNewBidOffer = async (mainNodes: String[], offer: any) => {
    try {
    const clusterToAddBidOffer = await findBidCluster(mainNodes, offer.id)
        const nodeToAddBidOffer = mainNodes[clusterToAddBidOffer]
        return await axios.post(`http://${nodeToAddBidOffer}/bids/offer`, offer).then(resp => { return resp }).catch(err => { return err });
    }
    catch (e) {
        return Promise.reject(e)
    }
}
const addToBidMap = function (bidId: string, clusterToAddBid: number) {
    bidMap[clusterToAddBid].push(bidId);
}

export const updateBidMap = async (mainNodes: String[]) => {
    try {
        let bidsByNodes = await getFromMainNodesByNodes(mainNodes, "bids")
        bidMap = bidsByNodes.map((l: { _id: string; }[]) => l.map(bid => bid._id))
        return Promise.resolve()
    } catch (e) {
        return Promise.reject(e)
    }
}

const findBidCluster = async function (mainNodes: String[], bidId: string) {
    return await findCluster(mainNodes, bidMap, bidId, updateBidMap)
}