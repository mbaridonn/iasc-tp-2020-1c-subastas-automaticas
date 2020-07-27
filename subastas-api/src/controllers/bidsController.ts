import { getFromMainNodes } from '../utils/nodes';
import axios from 'axios'

let bidMap: number[][] = [[], [], []];

export const getAllBidsFromNodes = async (mainNodes: String[]) => {
  console.log(bidMap)
    return await getFromMainNodes(mainNodes, "bids");
}

export const addNewBid = async (mainNodes: String[], bid: any) => {
    const clusterToAddBid = nextBidCluster(bidMap)
    const nodeToAddBid = mainNodes[clusterToAddBid]
    bid.id = getNextNodeId();

    await axios.post(`http://${nodeToAddBid}/bids/new`, bid);

    addToBidMap(bidMap, bid.id, clusterToAddBid);
}

export const closeBid = async (bid: any) => {
    const clusterToCloseBid = findBidCluster(bidMap, bid.id)
    const index = bidMap[clusterToCloseBid].indexOf(bid.id);
    bidMap[clusterToCloseBid].splice(index, 1);
}

export const updateBid = async (mainNodes: String[], bid: any) => {
    let responseMessage = "";

    const clusterToUpdateBid = findBidCluster(bidMap, bid.id);

    if (clusterToUpdateBid == -1) {
        responseMessage = "No existe la subasta!";
    } else {
        const bidNode = mainNodes[clusterToUpdateBid];
        //ToDo: hacer put con axios
        responseMessage = "Subasta modificada!";
    }

    return responseMessage;
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

const addToBidMap = async function (bidmap: number[][], bidId: number, clusterToAddBid: number) {
    bidmap[clusterToAddBid].push(bidId);
}

const findBidCluster = function (bidMap: number[][], bidId: number) {
    let i = 0;
    for (; i < bidMap.length; ++i) {
        if (bidMap[i].includes(bidId)) break;
    }

    if (i >= bidMap.length)
        return -1

    return i;
}